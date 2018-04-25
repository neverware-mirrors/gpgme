/* gpgme.js - Javascript integration for gpgme
 * Copyright (C) 2018 Bundesamt für Sicherheit in der Informationstechnik
 *
 * This file is part of GPGME.
 *
 * GPGME is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * GPGME is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, see <http://www.gnu.org/licenses/>.
 * SPDX-License-Identifier: LGPL-2.1+
 */
import { GPGMEJS_Error } from "./Errors";

/**
 * Tries to return an array of fingerprints, either from input fingerprints or
 * from Key objects
 * @param {Key |Array<Key>| GPGME_Key | Array<GPGME_Key>|String|Array<String>} input
 * @returns {Array<String>} Array of fingerprints.
 */

export function toKeyIdArray(input, nocheck){
    if (!input){
        GPGMEJS_Error('MSG_NO_KEYS');
        return [];
    }
    if (!Array.isArray(input)){
        input = [input];
    }
    let result = [];
    for (let i=0; i < input.length; i++){
        if (typeof(input[i]) === 'string'){
            if (isFingerprint(input[i]) === true){
                result.push(input[i]);
            } else {
                GPGMEJS_Error('MSG_NOT_A_FPR');
            }
        } else if (typeof(input[i]) === 'object'){
            let fpr = '';
            if (input[i] instanceof GPGME_Key){
                fpr = input[i].fingerprint;
            } else if (input[i].hasOwnProperty(primaryKey) &&
                input[i].primaryKey.hasOwnProperty(getFingerprint)){
                    fpr = input[i].primaryKey.getFingerprint();
            }
            if (isFingerprint(fpr) === true){
                result.push(fpr);
            } else {
                GPGMEJS_Error('MSG_NOT_A_FPR');
            }
        } else {
            return GPGMEJS_Error('PARAM_WRONG');
        }
    }
    if (result.length === 0){
        GPGMEJS_Error('MSG_NO_KEYS');
        return [];
    } else {
        return result;
    }
};

/**
 * check if values are valid hexadecimal values of a specified length
 * @param {*} key input value.
 * @param {int} len the expected length of the value
 */
function hextest(key, len){
    if (!key || typeof(key) !== "string"){
        return false;
    }
    if (key.length !== len){
        return false;
    }
    let regexp= /^[0-9a-fA-F]*$/i;
    return regexp.test(key);
};

/**
 * check if the input is a valid Hex string with a length of 40
 */
export function isFingerprint(string){
    return hextest(string, 40);
};
/**
 * check if the input is a valid Hex string with a length of 16
 */
function isLongId(string){
    return hextest(string, 16);
};

// TODO still not needed anywhere
function isShortId(string){
    return hextest(string, 8);
};
