*** Patrick Shannon / 10/05/17 ***

# Delvers: Curses of Risk and Rewards Proposal

## What is Delvers?
>A game about managing talent, resources, and risk as you fight through dungeons in turn-based combat, featuring permanent death.

I enjoy games that require thought and also crank up the stakes way high. The idea of consenquence is a big focus in the rouge-like genre, but it's not really prominant in other genres. I'd like to see some high stakes and punishment in a seemingly complicated turn based game that'll hopefully be optimized for mobile screens.

## Instructions for use

1. Create a character
2. Give your character a name
3. Allocate points into preferred stats
4. Press confirm
5. (Optional) Repeate steps 1-4.
6. (Optional <IMPORTANT>) DO NOT GIVE YOUR CHARACTERS THE SAME NAME AS AN EXISTING CHARACTER!!
7. Press the attack button
8. Select perferred attack method
9. Select target
10. repeat steps 7-9 until someone dies
11. repeat all as needed.

## Wireframe

Forgive me GA, for I have sinned. I made this project without wireframing. I'm typically big on wireframing but I spent a significant amount of time not knowing how it was going to look and I didn't want to lose time waiting for inspiration, so I improvised on the spot. It'll feel dirty if I just drew up a wireframe after the fact, so I'll accept any repercussions I may incurr. Don't worry, I fully understand the significance and importance of a wireframe and all of my projects excluding this one, had a wireframe.

## Initial thoughts on game structure
This project, especially with the given timeframe will not be easy. I will need to create a lot of interfaces; character menus, equipments, spells, team settings, locations, a main menu, a combat screen, and a lot of other things depending on how much progress I make. Not to mention the actual game logic, I'll have to manage a modular style of having entities take turns making actions, I'll also have to manage a database or proceedurally generate the various items that will be found in the game. The monsters that will be fought and the various bosses will need consideration and the rabit hole only gets deeper. I sometimes feel like this might be too ambitious, but I'm a little tired of not pushing myself to my limit for things that I actually want to do. Ultimately I'll be satisfied with just completing the minimum version project.

## Phases of Completion

# Phase -2:

>- ~~basic interface exists~~
>- ~~characters exist~~
>- ~~characters can harm each other~~
>- ~~characters can die~~
>- ~~characters have stats~~
>- ~~characters can take turns~~

# Phase -1:

>- ~~interface becomes modular and can display different information~~
>- ~~monsters can exist~~
>- ~~monsters can differentiate from each other~~
>- ~~selecting a battle target will populate a list of possible targets~~
>- ~~characters and monsters can select an action on thier turn~~
>- ~~basic battle actions exist and have effec~~t
>- ~~character stats have an effect on a character's performances~~

# Phase 0:

>- character and monster inventories can exist
>- items can exist
>- items can exist outside of a characters' or monsters' inventory
>- items can be used and have an effect
>- equipments exist
>- characters and monsters can hold equipment
>- they can also equip them and have their stats modified by them

# Phase: 1:

>- characters and monsters can learn abilities
>- characters can hold abilities
>- characters can use abilities
>- abilities have an effect

# in betweens...
>- tbd

# Phase 4:

>- Interfaces exist
>- Characters can be organized into teams
>- Characters can embark on missions
>- Characters can die
>- Characters can have an inventory
>- Characters can use items in thier inventories
>- Characters can equip items
>- Characters can have thier stats and behavoirs modified by thier equipment
>- the player can die and cause a game over
>- the player can kill the final boss and win the game
>- the dungeons can generate monsters
>- the monsters can die
>- the corpses they leave behind can be harvested
>- the harvest will return an appropreiate item
>- those items can be sold for money
>- the player can manage money
>- the player can buy items from a shop
>- Characters can learn skills
>- Characters can level up
>- Characters can have stats 
>- Character's stats will influence thier performance through the game
>- characters and monsters will have a degree of automated logic where they pick an action on thier turn
>- monsters can have stats
>- monsters can have slightly varying stats
>- monsters will have thier behavoirs changed by thier stats
>- monsters and characters can take turns 
>- a monster's or character's turn position is dependant on thier last action's speed
>- items can be sold
>- items can be found in dungeons
>- the dungeons can be navigated
>- the dungeons can be exited
>- battles can start
>- battles can end
>- battles can be escaped by either party

(The steps or phases you expect to go through, and the tasks that you'll need to accomplish to reach each step. These should resemble the acceptance criteria we were working through earlier.)

## Explaination of technologies used

- Vanilla Javascript DOM manipulation: Used to dynamically display information to the window.

- Javascript objects: Used to manage and instantiate various aspects of the game, like the characters and the game handler object

- Vanilla CSS: Used to lightly style and position the elements on the window

- Vanilla HTML: Used to put elements and information on the window

## Links and Resources
- [~~Creating modular js files~~](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) Doesn't work with current javascript version

(Anything you've looked up so far or are thinking about using.)
