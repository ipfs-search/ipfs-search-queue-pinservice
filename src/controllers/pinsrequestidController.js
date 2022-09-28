import * as service from '../services/pinsrequestidService.js';

export function funcpinsrequestid(req, res) {
    service.funcpinsrequestid(req, res);
}

export function getPinByRequestId(req, res) {
    service.getPinByRequestId(req, res);
}

export function replacePinByRequestId(req, res) {
    service.replacePinByRequestId(req, res);
}

export function deletePinByRequestId(req, res) {
    service.deletePinByRequestId(req, res);
}

