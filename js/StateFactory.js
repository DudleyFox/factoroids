import ShipWarehouse from "./ShipWarehouse.js";
import Ship from './Ship.js';
import GhostShip from './GhostShip.js';
import SpecialFlip from './SpecialFlip.js';
import Point from './Point.js';

export default function (options) {
        const {upperBounds, keyHandler} = options
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
        const shipOptions = {
            origin: new Point(upperBounds.x / 2, upperBounds.y / 2),
            upperBounds,
            keyHandler,
            state,
            maxSize:50
        };
        state.ship = new Ship(shipOptions);
        const delta = 48;
        for (let i = 0; i < state.lifeCount - 1; ++i) {
            const gsOptions = {
                origin: new Point(upperBounds.x - delta, delta + delta * i),
                upperBounds,
                number: state.shipNumber,
                stepSize: state.shipStepSize,
                maxSize: 50
            };
            state.lives.push(new GhostShip(gsOptions));
        }
        state.ship.setSpecial(new SpecialFlip());
        return state;
    }
