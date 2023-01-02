import { NumDictionary as NumberDictionary, StrictEnumDictionary } from '@/utils';
import { throwExpression } from '@/utils/error/throw-expression';

export enum ChessCoordinate {
    a1 = 'a1',
    a2 = 'a2',
    a3 = 'a3',
    a4 = 'a4',
    a5 = 'a5',
    a6 = 'a6',
    a7 = 'a7',
    a8 = 'a8',
    b1 = 'b1',
    b2 = 'b2',
    b3 = 'b3',
    b4 = 'b4',
    b5 = 'b5',
    b6 = 'b6',
    b7 = 'b7',
    b8 = 'b8',
    c1 = 'c1',
    c2 = 'c2',
    c3 = 'c3',
    c4 = 'c4',
    c5 = 'c5',
    c6 = 'c6',
    c7 = 'c7',
    c8 = 'c8',
    d1 = 'd1',
    d2 = 'd2',
    d3 = 'd3',
    d4 = 'd4',
    d5 = 'd5',
    d6 = 'd6',
    d7 = 'd7',
    d8 = 'd8',
    e1 = 'e1',
    e2 = 'e2',
    e3 = 'e3',
    e4 = 'e4',
    e5 = 'e5',
    e6 = 'e6',
    e7 = 'e7',
    e8 = 'e8',
    f1 = 'f1',
    f2 = 'f2',
    f3 = 'f3',
    f4 = 'f4',
    f5 = 'f5',
    f6 = 'f6',
    f7 = 'f7',
    f8 = 'f8',
    g1 = 'g1',
    g2 = 'g2',
    g3 = 'g3',
    g4 = 'g4',
    g5 = 'g5',
    g6 = 'g6',
    g7 = 'g7',
    g8 = 'g8',
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6',
    h7 = 'h7',
    h8 = 'h8',
}

const _chessCoordinateList = [ChessCoordinate.a1, ChessCoordinate.a2, ChessCoordinate.a3, ChessCoordinate.a4, ChessCoordinate.a5, ChessCoordinate.a6, ChessCoordinate.a7, ChessCoordinate.a8, ChessCoordinate.b1, ChessCoordinate.b2, ChessCoordinate.b3, ChessCoordinate.b4, ChessCoordinate.b5, ChessCoordinate.b6, ChessCoordinate.b7, ChessCoordinate.b8, ChessCoordinate.c1, ChessCoordinate.c2, ChessCoordinate.c3, ChessCoordinate.c4, ChessCoordinate.c5, ChessCoordinate.c6, ChessCoordinate.c7, ChessCoordinate.c8, ChessCoordinate.d1, ChessCoordinate.d2, ChessCoordinate.d3, ChessCoordinate.d4, ChessCoordinate.d5, ChessCoordinate.d6, ChessCoordinate.d7, ChessCoordinate.d8, ChessCoordinate.e1, ChessCoordinate.e2, ChessCoordinate.e3, ChessCoordinate.e4, ChessCoordinate.e5, ChessCoordinate.e6, ChessCoordinate.e7, ChessCoordinate.e8, ChessCoordinate.f1, ChessCoordinate.f2, ChessCoordinate.f3, ChessCoordinate.f4, ChessCoordinate.f5, ChessCoordinate.f6, ChessCoordinate.f7, ChessCoordinate.f8, ChessCoordinate.g1, ChessCoordinate.g2, ChessCoordinate.g3, ChessCoordinate.g4, ChessCoordinate.g5, ChessCoordinate.g6, ChessCoordinate.g7, ChessCoordinate.g8, ChessCoordinate.h1, ChessCoordinate.h2, ChessCoordinate.h3, ChessCoordinate.h4, ChessCoordinate.h5, ChessCoordinate.h6, ChessCoordinate.h7, ChessCoordinate.h8];

const _chessCoordinateToIndexMap: StrictEnumDictionary<ChessCoordinate, number> = _chessCoordinateList.reduce((acc, val, i) => ({ ...acc, [val]: i }), {} as any); 
const _chessCoordinateFromIndexMap: NumberDictionary<ChessCoordinate> = _chessCoordinateList.reduce((acc, val, i) => ({ ...acc, [i]: val }), {} as any); 
const _chessCoordinateToMatrixIndexMap: StrictEnumDictionary<ChessCoordinate, [number, number]> = _chessCoordinateList.reduce((acc, val, i) => ({ ...acc, [val]: [Math.floor(i / 8), i % 8] }), {} as any); 
const _chessCoordinateFromMatrixIndexMap: NumberDictionary<NumberDictionary<ChessCoordinate>> = _chessCoordinateList.reduce((acc, val, i) => {
    const cIndex = Math.floor(i / 8);
    const rIndex = i % 8;
    if (acc[cIndex] == null) acc[cIndex] = {};
    acc[cIndex][rIndex] = val;
    return acc;
}, {} as any);

export const chessCoordinateToIndex = (coordinate: ChessCoordinate) => {
    return _chessCoordinateToIndexMap[coordinate] ?? throwExpression('Invalid chessboard coordinate');
};

export const chessCoordinateFromIndex = (index: number) => {
    return _chessCoordinateFromIndexMap[index] ?? throwExpression('Invalid chessboard index');
};

export const chessCoordinateToMatrixIndex = (coordinate: ChessCoordinate) => {
    return _chessCoordinateToMatrixIndexMap[coordinate];
};

export const chessCoordinateFromMatrixIndex = (cIndex: number, rIndex: number) => {
    return _chessCoordinateFromMatrixIndexMap[cIndex]?.[rIndex] ?? throwExpression('Invalid chessboard index');
};