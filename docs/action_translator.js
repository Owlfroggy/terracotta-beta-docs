// this might actually genuinely be the worst code ive ever written
// i will probably go to hell for this
const DATADUMP_VERSION = "1.0.0-beta.4";

let datadump = null;
async function loadData() {
  try {
    const baseUrl = window.siteBaseUrl || '/';
    const assetRelativePath = `${baseUrl}assets/datadump_${DATADUMP_VERSION}.json`;
    const targetUrl = new URL(assetRelativePath, window.location.href);
    const response = await fetch(targetUrl); 
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    datadump = await response.json();
    customElements.define('tc-action-translator', ActionTranslator);
  } catch (error) {
    console.error("Could not load JSON file:", error);
  }
}
loadData();

function getActionsOfBlock(block) {
  return [
    ...Object.entries(datadump.actions[block] ?? {})
    .filter(([name, data]) => !data.legacy)
    .map(([name]) => name)
  ];
}

const selectableBlocks = [
  "Player Event",
  "Entity Event",
  "Game Event",
  "Player Action",
  "Entity Action",
  "Game Action",
  "Set Variable",
  "If Player",
  "If Entity",
  "If Game",
  "If Variable",
  "Select Object",
  "Control",
  "Repeat",
];

const blockKeywordMap = {
  "PLAYER EVENT": "playerevent",
  "ENTITY EVENT": "entityevent",
  "GAME EVENT": "gameevent",
  
  "PLAYER ACTION": "player",
  "ENTITY ACTION": "entity",
  "GAME ACTION": "game",
  "IF PLAYER": "player",
  "IF ENTITY": "entity",
  "IF GAME": "game",
};

const actionOperatorMap = {
  "+": [false],
  "-": [false],
  "x": [false, "*"],
  "/": [false],
  "%": [false],
  "Exponent": [false, "**"],
  "+=": [true],
  "-=": [true],
  "=": [true],
}

const conditionOperatorMap = {
  "<=": "<=",
  "<": "<",
  ">=": ">=",
  ">": ">",
  "=": "==",
  "!=": "!=",
}

function convert(blockName, actionSignName) {
  blockName = blockName.toUpperCase();
  if (blockName == "LOADER") return "he start the loader ;-;"
  if (!(blockName in datadump.actions)) return 'Invalid block name';
  const actionData = datadump.actions[blockName]?.[actionSignName];
  if (!actionData) return actionSignName == '' ? "Generated code appears here" : 'Invalid action name';
  let tcName = actionData.tc_name;
  if (!tcName) return 'This action is not currently available in Terracotta.';
  
  // game namespace vs. event namespace
  let blockKeyword = blockKeywordMap[blockName];
  if (blockKeyword == "game" && datadump.event_namespace_actions.includes(actionSignName)) {
    blockKeyword = "event";
  }

  // set var/if var namespaces
  if (blockName == "SET VARIABLE" || blockName == "IF VARIABLE") {
    const mapId = blockName == "SET VARIABLE" ? "type_namespace_actions" : "type_namespace_conditions";
    for (const [namespace, actions] of Object.entries(datadump[mapId])) {
      if (actions.includes(actionSignName)) {
        blockKeyword = namespace;
        break;
      }
    }
    if (!blockKeyword) return 'This action is not currently available in Terracotta.'
  }
  else if (blockName == "SELECT OBJECT") {
    blockKeyword = datadump.create_selection_actions.includes(actionSignName) ? "select" : "filter";
  }


  switch (blockName) {
    case "PLAYER EVENT":
    case "ENTITY EVENT":
    case "GAME EVENT": {
      return (
        `<span class="kd">${blockKeyword}</span>`
        +`<span class="err"> ${tcName} </span>`
        +`<span class="pp">{</span>`
        +`<br><br>`
        +`<span class="pp">}</span>`
      );
    }
    case "PLAYER ACTION":
    case "ENTITY ACTION": 
    case "GAME ACTION": 
    case "SET VARIABLE": {
      let extra = "";
      let operatorEntry = actionOperatorMap[actionSignName];
      if (operatorEntry) {
        extra = `a <span class="o">${operatorEntry[1] ?? actionSignName}</span> b`;
        if (operatorEntry[0]) {
          extra += ";";
        }
        extra += `<br><span class="cm">or</span><br>`
      }

      return extra+(
        `<span class="nn">${blockKeyword}</span>`
        +`<span class="o">.</span>`
        +`<span class="nf">${tcName}</span>`
        +`<span class="pp">()</span>`
      );
    }
    case "IF PLAYER":
    case "IF ENTITY": 
    case "IF GAME": 
    case "IF VARIABLE": {
      let extra = "";
      let operatorEntry = conditionOperatorMap[actionSignName];
      if (operatorEntry) {
        extra =`<span class="k">if</span>`
              +`<span class="err"> </span>`
              +`<span class="pp">(</span>`
              +`a <span class="o">${operatorEntry}</span> b`
              +`<span class="pp">)</span>`
              +`<span class="err"> </span>`
              +`<span class="pp">{</span>`
              +`<br><br>`
              +`<span class="pp">}</span>`
        extra += `<br><span class="cm">or</span><br>`
      }

      return extra+(
        `<span class="k">if</span>`
        +`<span class="err"> </span>`
        +`<span class="pp">(</span>`
        +`<span class="nn">${blockKeyword}</span>`
        +`<span class="o">.</span>`
        +`<span class="nf">${tcName}</span>`
        +`<span class="pp">(</span>`
        +`<span class="pp">))</span>`
        +`<span class="err"> </span>`
        +`<span class="pp">{</span>`
        +`<br><br>`
        +`<span class="pp">}</span>`
      );
    }
    case "CONTROL": {
      switch (actionSignName) {
        case "End":
        case "EndAllThreads":
        case "Return":
        case "StopRepeat":
        case "Skip":
          if (actionSignName == "Return") tcName = "return";
          if (actionSignName == "StopRepeat") tcName = "break";
          if (actionSignName == "Skip") tcName = "continue";
          return (
            `<span class="k">${tcName.toLowerCase()}</span>`
            +`<span class="err">;</span>`
          );
        case "PrintDebug":
        case "Wait": {
          if (actionSignName == "PrintDebug") tcName = "print";
          return (
            `<span class="k">${tcName.toLowerCase()}</span>`
            +`<span class="pp">(</span>`
            +`<span class="pp">)</span>`
            +`<span class="err">;</span>`
          );
        }
      }
    }
    case "SELECT OBJECT": {
      return (
        `<span class="k">${blockKeyword} </span>`
        +`<span class="nf">${tcName}</span>`
        +`<span class="pp">(</span>`
        +`<span class="pp">)</span>`
        +`<span class="err">;</span>`
      )
    }
    case "REPEAT": {
      switch (actionSignName) {
        case "Forever": {
          return (
            `<span class="k">repeat </span>`
            +`<span class="pp">{</span>`
            +`<br><br>`
            +`<span class="pp">}</span>`
          );
        }
        case "Multiple": {
          return (
            `<span class="k">repeat </span>`
            +`<span class="pp">(</span>`
            +`<span class="m">n</span>`
            +`<span class="pp">) </span>`
            +`<span class="pp">{</span>`
            +`<br><br>`
            +`<span class="pp">}</span>`
          );
        }
        case "While": {
          return (
            `<span class="k">while </span>`
            +`<span class="pp">(</span>`
            +`condition`
            +`<span class="pp">) </span>`
            +`<span class="pp">{</span>`
            +`<br><br>`
            +`<span class="pp">}</span>`
          );
        }
        case "DoWhile": {
          return (
            `<span class="k">do </span>`
            +`<span class="pp">{</span>`
            +`<br><br>`
            +`<span class="pp">}</span>`
            +`<span class="k"> while </span>`
            +`<span class="pp">(</span>`
            +`condition`
            +`<span class="pp">) </span>`
          );
        }
        case "ForEach": {
          return (
            `<span class="k">for </span>`
            +`<span class="pp">(</span>`
            +`<span class="nv">value_getter</span>`
            +`<span class="k"> of </span>`
            +`<span class="nv">list</span>`
            +`<span class="pp">) </span>`
            +`<span class="pp">{</span>`
            +`<br><br>`
            +`<span class="pp">}</span>`
          );
        }
        case "ForEachEntry": {
          return (
            `<span class="k">for </span>`
            +`<span class="pp">(</span>`
            +`<span class="nv">key_getter</span>`
            +`<span class="o">, </span>`
            +`<span class="nv">value_getter</span>`
            +`<span class="k"> of </span>`
            +`<span class="nv">dict</span>`
            +`<span class="pp">) </span>`
            +`<span class="pp">{</span>`
            +`<br><br>`
            +`<span class="pp">}</span>`
          );
        }
        default: {
          return (
            `<span class="k">for </span>`
            +`<span class="pp">(</span>`
            +`<span class="nv">value_getter</span>`
            +`<span class="k"> of </span>`
            +`<span class="nf">${tcName}</span>`
            +`<span class="pp">())</span>`
            +`<span class="pp">{</span>`
            +`<br><br>`
            +`<span class="pp">}</span>`
          );
        }
      }
    }
  }
  return 'Failed to convert action, please report this as a bug.'
}

class ActionTranslator extends HTMLElement {
  constructor() {
    super();
  }

  static latestId = 0;
  connectedCallback() {
    const id  = ActionTranslator.latestId;
    ActionTranslator.latestId++;  
    const defaultAction = this.getAttribute('block') ?? "Player Action";
    this.innerHTML = 
`
<div class="inventory_bg slicebg">
    <div class="mctext title">DF Action » Terracotta Converter</div>
    <div class="mctext">Code block:</div>
    <div class="dropdown_bg slicebg">
      <input type="text" spellcheck="false" class="mctext shadow editbox _block" value="${defaultAction}" placeholder="Click to edit"></input>
    </div>

    <div style="height: calc(var(--pixel-scale)*2);"></div>

    <div class="mctext">Action (sign name):</div>
    <div class="dropdown_bg slicebg">
      <input id="action" spellcheck="false" type="text" class="mctext shadow editbox _action" placeholder="Click to edit"></input>
    </div>

</div>
<pre id="_converter_${id}" class="mccodebox highlight slicebg md-code__content">
  
</pre>

<div class="autocomplete_dropdown" tabindex=-1>
</div>
`

    const blockInput = this.getElementsByClassName("_block")[0];
    const actionInput = this.getElementsByClassName("_action")[0];
    const codeBox = this.getElementsByClassName("mccodebox")[0];

    /** @type {HTMLElement} */
    const dropdown = this.getElementsByClassName("autocomplete_dropdown")[0];
    /** @type {HTMLInputElement | null} */
    let dropdownAttach = null;
    /** @type {HTMLButtonElement} */
    let focusedDropdownOption = null;
    dropdown.hidden = false;
    document.body.appendChild(dropdown);

    /** @param {HTMLInputElement | null} to  */
    function attachDropdown(to) {
      if (to == null) {
        dropdown.hidden = true;
      } else {
        dropdown.hidden = false;
        to.parentElement.appendChild(dropdown);
      }
      dropdownAttach = to;
    }

    /** @param {HTMLButtonElement} b */
    function focusDropdownOption(b) {
      if (focusedDropdownOption) 
        unfocusDropdownOption(focusedDropdownOption);
      b.style.color = "#ffff00";
      focusedDropdownOption = b;
    }
    /** @param {HTMLButtonElement} b */
    function unfocusDropdownOption(b) {
      b.style.color = "#ffffff";
      focusedDropdownOption = null;
    }
    function moveFocusedDropdownOption(direction) {
      if (dropdown.children.length == 0) return;
      let index;
      if (focusedDropdownOption == null) {
        if (direction == -1) {
          index = dropdown.children.length-1;
        } else {
          index = dropdown.children.item(0);
        }
      }
      else {
        let currentIndex = -1;
        for (currentIndex = 0; currentIndex < dropdown.children.length; currentIndex++) {
          if (dropdown.children.item(currentIndex) == focusedDropdownOption) break;
        }
        console.log(currentIndex);
        index = currentIndex + direction;
      }

      if (index != null) {
        // wrapping
        if (index > dropdown.children.length-1) {
          index = 0;
        } else if (index < 0) {
          index = dropdown.children.length-1;
        }
        let b = dropdown.children.item(index)
        focusDropdownOption(b);
        b.scrollIntoView({block: "nearest", behavior: "smooth"});
      }
    }

    function applyFocusedDropdownOption() {
      dropdownAttach?.blur()
      if (dropdownAttach == blockInput) actionInput.focus();
      if (focusedDropdownOption && focusedDropdownOption.parentElement == dropdown) {
        dropdownAttach.value = focusedDropdownOption.textContent;
        console.log(focusedDropdownOption.parentElement);
      }
      attachDropdown(null)
      refreshCodeBlock();
    }

    function refreshDropdownContents() {
      dropdown.innerHTML = "";
      if (!dropdownAttach) return;
      let entries = [];
      if (dropdownAttach == blockInput) {
        entries = [...selectableBlocks];
      } else if (dropdownAttach == actionInput) {
        let block = blockInput.value.toUpperCase();
        entries = getActionsOfBlock(block);
      }

      console.log(dropdownAttach.value);
      entries = entries
        .filter(v => v.toLowerCase().includes(dropdownAttach.value.toLowerCase()))
        .sort((a, b) => {
          a = a.trim();
          b = b.trim();
          const aStartsWithKey = a.toLowerCase().startsWith(dropdownAttach.value.toLowerCase());
          const bStartsWithKey = b.toLowerCase().startsWith(dropdownAttach.value.toLowerCase());

          // 1. Priority check: If one starts with the key and the other doesn't
          if (aStartsWithKey && !bStartsWithKey) return -1;
          if (!aStartsWithKey && bStartsWithKey) return 1;

          // 2. Alphabetical tie-breaker: Both start with key OR neither does
          return a.localeCompare(b, undefined, { sensitivity: 'base' });
        });
      ;

      let first = true;
      for (const e of entries) {
        const a = dropdownAttach;
        let b = document.createElement("button");
        b.className = "mctext shadow specialfocus";
        b.textContent = e;
        b.tabIndex = -1;
        b.addEventListener("pointerdown", () => focusDropdownOption(b));
        b.addEventListener("pointerup", (event) => {
          event.preventDefault();
          applyFocusedDropdownOption();
        });
        b.addEventListener("mouseenter", () => {
          focusDropdownOption(b);
        });
        dropdown.appendChild(b);

        if (first) {
          focusDropdownOption(b);
          first = false;
        }
      }
    }

    function refreshCodeBlock() {
      const button = `<nav class="md-code__nav"><button class="md-code__button" title="Copy to clipboard" data-clipboard-target="#_converter_${id}" data-md-type="copy"></button></nav>`;
      codeBox.innerHTML = button + '<div class="codecontents">'+convert(blockInput.value, actionInput.value)+"</div>";
    }
    refreshCodeBlock();

    for (const elm of this.getElementsByClassName("editbox")) {
      let oldValue = null;
      elm.addEventListener("focus", (event) => {
        if (dropdownAttach != elm) {
          oldValue = elm.value;
          elm.value = "";
        }
        setTimeout(() => {
          attachDropdown(elm);
          refreshDropdownContents();
        }, 2)
      })
      elm.addEventListener("focusout", (event) => {
        setTimeout(() => {
          if (
            document.activeElement != null && (
              document.activeElement.className.includes("editbox")
              || document.activeElement.className.includes("specialfocus")
            )
          ) {
            // do nothing, ignore this focusout
          } else {
            attachDropdown(null);
          }
          if (
            elm.value == "" 
            && !document.activeElement.className.includes("specialfocus")
          ) {
            elm.value = oldValue;
          }
        }, 1)
      })
      elm.addEventListener('input', (event) => {
        refreshDropdownContents();
        refreshCodeBlock();
      })
      elm.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          moveFocusedDropdownOption(-1)
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          moveFocusedDropdownOption(1)
        } else if (event.key === 'Enter') {
          if (focusedDropdownOption) {
            event.preventDefault()
            applyFocusedDropdownOption();
          }
        } else if (event.key == 'Escape') {
          elm.blur();
        }
      });

      document.addEventListener("pointerup", () => {
        if (dropdownAttach) dropdownAttach.focus();
      })
    }
  }
}
