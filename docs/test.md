test page for this website

note: the code here is from [this repo](https://github.com/Owlfroggy/piston-jam-game)


??? tip "Expand this box to convert DiamondFire code blocks to their Terracotta equivalents."
    <tc-action-translator block="Player Action">Loading...</tc-action-translator>

??? tip "Expand this box to convert DiamondFire code blocks to their Terracotta equivalents."
    <tc-action-translator block="Control">Loading...</tc-action-translator>

## syntax highlighting test

```tc

'asdf'
"asdf"
"\∆ \xFF \uFFFF \u{FFFFFFFF} \\ \' \""

0_0.12_123
00.102
0xFF
0b1010103003

// single-line
e
/* single-line fancy */
e
/* mul
 line
 */
e

line dingus: dongus;

player.uuid;
...plural: str;






gameevent startup {
    // constant data
    declare global AXIS_TO_YAW: dict[num] = {
        // vector keys get stringified here but thats fine
        (vec(1,0,0) as str): -90,
        (vec(-1,0,0) as str): 90,
        (vec(0,0,1) as str): 0,
        (vec(0,0,-1) as str): 180,
    };

    /** How many ticks it takes to complete a movement */
    declare global PLAYER_MOVEMENT_TIME = 6;


    // variable data
    declare global latest_game_id = 0;
}


playerevent command {
    line cmd = event.commandArguments[1];
    call "cmd %var(cmd)";
}

/**
 * Starts a game for the currently selected player
 */
function game_start() {
    latest_game_id += 1;
    line game_id = latest_game_id;
    global "game_id p#%default" = game_id;
    global "origin g#%var(game_id)" = loc(11, 50, 9); // TODO: use slot management
    global "owner_uuid g#%var(game_id)" = default.uuid;

    player_spawn(loc(11, 50, 9)); // TODO: get spawn point from map
}

/** 
 * Assumes all player entities have already been set up
 */
process player_loop {repeat {
    // actual player manipulation
    default.setToSpectatorMode();
    default.spectateTarget(global "cam_uuid p#%default");

    // camera stuff
    select entitiesByUUID(global "cam_uuid p#%default");
        line between = vec.between(global "cam_pos p#%default",global "pos p#%default");
        if (!global "hold_cam_target_pos p#%default") {
            global "cam_target_pos p#%default" = lerp_loc(global "cam_target_pos p#%default",global "pos p#%default"+vec(.5),0.8);
        }
        global "cam_pos p#%default" = lerp_loc(global "cam_pos p#%default",global "cam_target_pos p#%default",0.6);
        entity.setDisplayTeleportDuration(3);
        entity.teleport(global "cam_pos p#%default" + vec(0, 10, 0));
        entity.setRotation(90,-90);
    select reset;

    perselected {}

    wait;
}}






/** 
 * CLEARS SELECTION!
 * This function waits until the movement animation is complete
 */
function player_move(dir: vec) {
    if (dir == vec(0,0,0)) {
        print("Player_move called with invalid direction",dir,style="Error");
        return;
    }
    if (!global "can_move p#%default") { return; }
    line newPos: loc;
    line dist = 0;
    repeat {
        line newPos = global "pos p#%default" + dir;
        // TODO: use actual block properties
        line m = game.getBlockMaterial(newPos, returnValue="Item");
        if (item.isSolid(m)) {
            // wall particles
            default.displayParticleEffect(
                par("Block", amount=20, material=m.getMaterial(), spreadHoriz=0, spreadVert=0.5),
                global "pos p#%default" + vec(0.5, 0.5, 0.5) + dir*.25
            );
            break;
        }
        dist += 1;
        global "pos p#%default" = newPos;
        // break after so you still enter the target block
        if (game.getBlockMaterial(newPos-vec(0,1,0)) == "target") {
            break;
        }
    }

    global "cam_target_pos p#%default" = global "pos p#%default"+vec(.5)+(dir*(dist.clamp(1,1000)).exponent(0.75));
    
    if (dist == 0) { 
        default.playSound(
            snd("Basalt Break"),
            snd("Cherry Wood Button Click Off")
        );
        return; 
    }
    
    global "hold_cam_target_pos p#%default" = 1;
    global "can_move p#%default" = 0;

    default.playSound(snd("Mace Smash Ground", num.randomd(1.8,2), .5), global "pos p#%default");

    // piston animation
    select entitiesByUUID(global "char_head_uuid p#%default");
        entity.setDisplayScale(1,1,1);
        entity.setDisplayRotationFromEulerAngles(0,AXIS_TO_YAW[str.setToString(dir)],0);
        entity.teleport(global "pos p#%default" + vec(.5,.5,.5));
    select entitiesByUUID(global "char_arm_uuid p#%default");
        entity.setDisplayInterpolation(0);
        entity.setDisplayScale(vec(1,dist,1));
        entity.setDisplayTranslation(dir * (dist * -.5 +.5));
        entity.setDisplayRotationFromEulerAngles(-90,AXIS_TO_YAW[str.setToString(dir)],0);
        entity.teleport(global "pos p#%default" + vec(.5,.5,.5));
        wait(3);
        entity.setDisplayInterpolation(PLAYER_MOVEMENT_TIME-2);
        entity.setDisplayScale(vec(1,.99,1));
        entity.setDisplayTranslation(vec(0,0,0));
    select entitiesByUUID(global "char_uuid p#%default");
        // for some reason it spazzes if this check isnt made
        if (global "last_move_dir p#%default" != dir) {
            entity.setDisplayRotationFromEulerAngles(0,AXIS_TO_YAW[str.setToString(dir)],0);
            entity.setDisplayInterpolation(1);
        }
        entity.teleport(global "pos p#%default" + vec(.5,.5,.5));
    select reset;

    
    default.playSound(snd("Piston Retract"), global "pos p#%default");
    wait(PLAYER_MOVEMENT_TIME-3-1);
    global "hold_cam_target_pos p#%default" = 0;
    wait(1);
    default.playSound(snd("Heavy Core Break"), global "pos p#%default");
    global "can_move p#%default" = 1;
    global "last_move_dir p#%default" = dir;
}




/** 
 * Assuming that the player has already been assigned to a game by the time this is called
 */
function player_spawn(at: loc) {
    // var setup
    global "pos p#%default" = at;
    global "cam_pos p#%default" = at;
    global "cam_vel p#%default" = vec(0,0,0);
    global "can_move p#%default" = 1;
    line game_id = global "game_id p#%default";

    // character
    game.spawnItemDisplay(at+vec(.5), litem("player_char","piston_base"));
    lastEntity.setDisplayTeleportDuration(PLAYER_MOVEMENT_TIME-2);
    lastEntity.setTag("game_id",game_id);
    global "char_uuid p#%default" = lastEntity.uuid;
    
    game.spawnItemDisplay(at+vec(.5), litem("player_char","piston_head"));
    lastEntity.setTag("game_id",game_id);
    global "char_head_uuid p#%default" = lastEntity.uuid;
    
    game.spawnItemDisplay(at+vec(.5), litem("player_char","piston_arm"));
    lastEntity.setTag("game_id",game_id);
    global "char_arm_uuid p#%default" = lastEntity.uuid;

    // camera
    game.spawnItemDisplay(at + vec(0,5,0), item("air"));
    lastEntity.setRotation(90, 0);
    lastEntity.setTag("game_id", game_id);
    global "cam_uuid p#%default" = lastEntity.uuid;

    start player_loop();
}
```


## shenanigan??
!!! bug
    !!! danger
        !!! failure
            !!! warning
                !!! question
                    !!! success
                        !!! tip
                            !!! info
                                !!! abstract
                                    !!! note
                                        !!! example
                                            ```tc
                                            print("hello worl");
                                            ```