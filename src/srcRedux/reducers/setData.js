import {
    SETCOUNTRY, SETLANGUAGE
} from '../actions/type';

const initialState = {};

function setCountry(state = initialState, action) {
    switch (action.type) {
        case SETCOUNTRY:
            return action.data;
        default:
            return state;
    }
}

function setLanguage(state = initialState, action) {
    switch (action.type) {
        case SETLANGUAGE:
            return action.data;
        default:
            return state;
    }
}

function setProfiles(state = initialState, action) {
    switch (action.type) {
        case SETPROFILES:
            return action.data;
        default:
            return state;
    }
}

function setRequestFlight(state = initialState, action) {
    switch (action.type) {
        case SET_REQUEST_FLIGHT_AVAIL:
            return action.data;
        default:
            return state;
    }
}

function setFlightValues(state = initialState, action) {
    switch (action.type) {
        case SET_FLIGHT_VALUES:
            return action.data;
        default:
            return state;
    }
}

function setItemFlightAvail(state = initialState, action) {
    switch (action.type) {
        case SET_ITEM_FLIGHT_AVAIL:
            return action.data;
        default:
            return state;
    }
}
function setFlightHolderContact(state = initialState, action) {
    switch (action.type) {
        case SET_FLIGHT_HOLDER_CONTACT:
            return action.data;
        default:
            return state;
    }
}
function setTourContact(state = [], action) {
    switch (action.type) {
        case SET_TOUR_CONTACT:
            return action.data;
        default:
            return state;
    }
}
function settourContactPassenger(state = initialState, action) {
    switch (action.type) {
        case SET_TOUR_CONTACTPASSENGER:
            return action.data;
        default:
            return state;
    }
}
function setFlightPax(state = initialState, action) {
    switch (action.type) {
        case SET_FLIGHT_PAX:
            return action.data;
        default:
            return state;
    }
}
function setValueFilterFlight(state = initialState, action) {
    switch (action.type) {
        case SET_VALUE_FILTER_FLIGHT:
            return action.data;
        default:
            return state;
    }
}


export {
    setCountry, setLanguage, setProfiles,
    setRequestFlight, setFlightValues,
    setItemFlightAvail, setFlightHolderContact,
    setFlightPax, setValueFilterFlight, setTourContact, settourContactPassenger
}