import ShipWarehouse from "./ShipWarehouse.js";
import Ship from './Ship.js';
import GhostShip from './GhostShip.js';
import SpecialFlip from './SpecialFlip.js';
import Point from './Point.js';

export default function (upperBounds, keyHandler) {
        const shipWarehouse = new ShipWarehouse();
        const state = {
            facts: [],
            bullets: [],
            lives: [],
            powerUps: [],
            lifeCount: 3,
            fb: [
                {
                    name: 'Default',
                },
                {
                    name: 'Splinter'
                }
            ],
            fbIndex: 0,
            fbCooldown: 0,
            shipNumber: 2,
            shipStepSize: 5
        };
        const shipState = shipWarehouse.buildShipState();
        state.shipNumber = shipState.shipNumber;
        state.shipStepSize = shipState.shipStepSize;
        state.shipColor = shipState.shipColor;
        const shipHull = shipState.shipHull;
        state.ship = new Ship(new Point(upperBounds.x / 2, upperBounds.y / 2), new Point(upperBounds.x, upperBounds.y), keyHandler, state, 50);
        const delta = 48;
        for (let i = 0; i < state.lifeCount - 1; ++i) {
            state.lives.push(new GhostShip(new Point(upperBounds.x - delta, delta + delta * i), new Point(upperBounds.x, upperBounds.y), state.shipNumber, state.shipStepSize, 50));
        }
        state.ship.setSpecial(new SpecialFlip());
        return state;
    }
