import { createSelector } from 'reselect';
import { Book } from '../models/book';
import * as book from '../actions/book.action';
import * as collection from '../actions/collection.action';

export interface State {
    ids: string[];
    entities: {
        [id: string]: Book
    };
    selectedBookId: string | null;
}


export const initialState: State = {
    ids: [],
    entities: {},
    selectedBookId: null
};

export function reducer(state: State = initialState, action: book.Actions | collection.Actions): State {

    switch (action.type) {
        case book.SEARCH_COMPLETE:
        case collection.LOAD_SUCCESS: {
            const books = action.payload;
            const newBooks = books.filter(book => !state.entities[book.id]);

            const newBookIds = newBooks.map(book => book.id);
            const newBookEntities = newBooks.reduce((entities: { [id: string]: Book }, book: Book) => {
                return Object.assign(entities, { [book.id]: book });
            }, {});

            return {
                ids: [...state.ids, ...newBookIds],
                entities: Object.assign({}, state.entities, newBookEntities),
                selectedBookId: state.selectedBookId
            };
        }
        case book.LOAD: {
            const book = action.payload;

            if (state.ids.indexOf(book.id) > -1) {
                return state;
            }

            return {
                ids: [...state.ids, book.id],
                entities: Object.assign({}, state.entities, {
                    [book.id]: book
                }),
                selectedBookId: state.selectedBookId
            };
        }

        case book.SELECT: {
            return {
                ids: state.ids,
                entities: state.entities,
                selectedBookId: action.payload
            };
        }
        default:
            return state;
    }
}


export const getEntities = (state: State) => state.entities;