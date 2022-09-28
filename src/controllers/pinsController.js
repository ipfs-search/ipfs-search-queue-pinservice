import * as service from '../services/pinsService.js';

export function getPins(req, res) {
    service.getPins(req, res);
}

export function addPin(req, res) {
    service.addPin(req, res);
}

