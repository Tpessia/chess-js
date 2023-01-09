import { ChessCoordinate, ChessCoordinateCode } from '@/models/chess/ChessCoordinate';
import { ChessPiece, ChessPieceBishop, ChessPieceKing, ChessPieceKnight, ChessPiecePawn, ChessPieceQueen, ChessPieceRook } from '@/models/chess/ChessPiece';
import { ChessPieceColor } from '@/models/chess/ChessPieceType';
import { ChessSquare } from '@/models/chess/ChessSquare';
import { EnumDictionary, NumberDictionary, StrictEnumDictionary } from '@/utils';
import { throwExpression } from '@/utils/error/throw-expression';

export type ChessBoardMatrix = ChessSquare[][];

type CoordinatePiece = { coordinate: ChessCoordinateCode, piece?: ChessPiece };

export const chessBoardMatrix: CoordinatePiece[][] = [
    [
        { coordinate: ChessCoordinateCode.a8, piece: new ChessPieceRook(ChessPieceColor.Black, ChessCoordinateCode.a8) },
        { coordinate: ChessCoordinateCode.b8, piece: new ChessPieceKnight(ChessPieceColor.Black, ChessCoordinateCode.b8) },
        { coordinate: ChessCoordinateCode.c8, piece: new ChessPieceBishop(ChessPieceColor.Black, ChessCoordinateCode.c8) },
        { coordinate: ChessCoordinateCode.d8, piece: new ChessPieceQueen(ChessPieceColor.Black, ChessCoordinateCode.d8) },
        { coordinate: ChessCoordinateCode.e8, piece: new ChessPieceKing(ChessPieceColor.Black, ChessCoordinateCode.e8) },
        { coordinate: ChessCoordinateCode.f8, piece: new ChessPieceBishop(ChessPieceColor.Black, ChessCoordinateCode.f8) },
        { coordinate: ChessCoordinateCode.g8, piece: new ChessPieceKnight(ChessPieceColor.Black, ChessCoordinateCode.g8) },
        { coordinate: ChessCoordinateCode.h8, piece: new ChessPieceRook(ChessPieceColor.Black, ChessCoordinateCode.h8) },
    ],
    [
        { coordinate: ChessCoordinateCode.a7, piece: new ChessPiecePawn(ChessPieceColor.Black, ChessCoordinateCode.a7) },
        { coordinate: ChessCoordinateCode.b7, piece: new ChessPiecePawn(ChessPieceColor.Black, ChessCoordinateCode.b7) },
        { coordinate: ChessCoordinateCode.c7, piece: new ChessPiecePawn(ChessPieceColor.Black, ChessCoordinateCode.c7) },
        { coordinate: ChessCoordinateCode.d7, piece: new ChessPiecePawn(ChessPieceColor.Black, ChessCoordinateCode.d7) },
        { coordinate: ChessCoordinateCode.e7, piece: new ChessPiecePawn(ChessPieceColor.Black, ChessCoordinateCode.e7) },
        { coordinate: ChessCoordinateCode.f7, piece: new ChessPiecePawn(ChessPieceColor.Black, ChessCoordinateCode.f7) },
        { coordinate: ChessCoordinateCode.g7, piece: new ChessPiecePawn(ChessPieceColor.Black, ChessCoordinateCode.g7) },
        { coordinate: ChessCoordinateCode.h7, piece: new ChessPiecePawn(ChessPieceColor.Black, ChessCoordinateCode.h7) },
    ],
    [
        { coordinate: ChessCoordinateCode.a6, piece: undefined },
        { coordinate: ChessCoordinateCode.b6, piece: undefined },
        { coordinate: ChessCoordinateCode.c6, piece: undefined },
        { coordinate: ChessCoordinateCode.d6, piece: undefined },
        { coordinate: ChessCoordinateCode.e6, piece: undefined },
        { coordinate: ChessCoordinateCode.f6, piece: undefined },
        { coordinate: ChessCoordinateCode.g6, piece: undefined },
        { coordinate: ChessCoordinateCode.h6, piece: undefined },
    ],
    [
        { coordinate: ChessCoordinateCode.a5, piece: undefined },
        { coordinate: ChessCoordinateCode.b5, piece: undefined },
        { coordinate: ChessCoordinateCode.c5, piece: undefined },
        { coordinate: ChessCoordinateCode.d5, piece: undefined },
        { coordinate: ChessCoordinateCode.e5, piece: undefined },
        { coordinate: ChessCoordinateCode.f5, piece: undefined },
        { coordinate: ChessCoordinateCode.g5, piece: undefined },
        { coordinate: ChessCoordinateCode.h5, piece: undefined },
    ],
    [
        { coordinate: ChessCoordinateCode.a4, piece: undefined },
        { coordinate: ChessCoordinateCode.b4, piece: undefined },
        { coordinate: ChessCoordinateCode.c4, piece: undefined },
        { coordinate: ChessCoordinateCode.d4, piece: undefined },
        { coordinate: ChessCoordinateCode.e4, piece: undefined },
        { coordinate: ChessCoordinateCode.f4, piece: undefined },
        { coordinate: ChessCoordinateCode.g4, piece: undefined },
        { coordinate: ChessCoordinateCode.h4, piece: undefined },
    ],
    [
        { coordinate: ChessCoordinateCode.a3, piece: undefined },
        { coordinate: ChessCoordinateCode.b3, piece: undefined },
        { coordinate: ChessCoordinateCode.c3, piece: undefined },
        { coordinate: ChessCoordinateCode.d3, piece: undefined },
        { coordinate: ChessCoordinateCode.e3, piece: undefined },
        { coordinate: ChessCoordinateCode.f3, piece: undefined },
        { coordinate: ChessCoordinateCode.g3, piece: undefined },
        { coordinate: ChessCoordinateCode.h3, piece: undefined },
    ],
    [
        { coordinate: ChessCoordinateCode.a2, piece: new ChessPiecePawn(ChessPieceColor.White, ChessCoordinateCode.a2) },
        { coordinate: ChessCoordinateCode.b2, piece: new ChessPiecePawn(ChessPieceColor.White, ChessCoordinateCode.b2) },
        { coordinate: ChessCoordinateCode.c2, piece: new ChessPiecePawn(ChessPieceColor.White, ChessCoordinateCode.c2) },
        { coordinate: ChessCoordinateCode.d2, piece: new ChessPiecePawn(ChessPieceColor.White, ChessCoordinateCode.d2) },
        { coordinate: ChessCoordinateCode.e2, piece: new ChessPiecePawn(ChessPieceColor.White, ChessCoordinateCode.e2) },
        { coordinate: ChessCoordinateCode.f2, piece: new ChessPiecePawn(ChessPieceColor.White, ChessCoordinateCode.f2) },
        { coordinate: ChessCoordinateCode.g2, piece: new ChessPiecePawn(ChessPieceColor.White, ChessCoordinateCode.g2) },
        { coordinate: ChessCoordinateCode.h2, piece: new ChessPiecePawn(ChessPieceColor.White, ChessCoordinateCode.h2) },
    ],
    [
        { coordinate: ChessCoordinateCode.a1, piece: new ChessPieceRook(ChessPieceColor.White, ChessCoordinateCode.a1) },
        { coordinate: ChessCoordinateCode.b1, piece: new ChessPieceKnight(ChessPieceColor.White, ChessCoordinateCode.b1) },
        { coordinate: ChessCoordinateCode.c1, piece: new ChessPieceBishop(ChessPieceColor.White, ChessCoordinateCode.c1) },
        { coordinate: ChessCoordinateCode.d1, piece: new ChessPieceQueen(ChessPieceColor.White, ChessCoordinateCode.d1) },
        { coordinate: ChessCoordinateCode.e1, piece: new ChessPieceKing(ChessPieceColor.White, ChessCoordinateCode.e1) },
        { coordinate: ChessCoordinateCode.f1, piece: new ChessPieceBishop(ChessPieceColor.White, ChessCoordinateCode.f1) },
        { coordinate: ChessCoordinateCode.g1, piece: new ChessPieceKnight(ChessPieceColor.White, ChessCoordinateCode.g1) },
        { coordinate: ChessCoordinateCode.h1, piece: new ChessPieceRook(ChessPieceColor.White, ChessCoordinateCode.h1) },
    ],
];

export const chessBoardMatrixFlat: CoordinatePiece[] = chessBoardMatrix.flat();

export const chessBoardMatrixDict: EnumDictionary<ChessCoordinateCode, CoordinatePiece> = chessBoardMatrixFlat.reduce((acc, val) => ({ ...acc, [val.coordinate]: val }), {});

const _chessCoordinateCodeMap: StrictEnumDictionary<ChessCoordinateCode, ChessCoordinate> = chessBoardMatrixFlat.reduce((acc, val, i) => ({ ...acc, [val.coordinate]: { code: val.coordinate, rowIndex: Math.floor(i / 8), colIndex: i % 8 } as ChessCoordinate }), {} as any);
const _chessCoordinateIndexMap: NumberDictionary<NumberDictionary<ChessCoordinate>> = chessBoardMatrixFlat.reduce((acc, val, i) => {
    const colIndex = i % 8;
    const rowIndex = Math.floor(i / 8);
    if (acc[rowIndex] == null) acc[rowIndex] = {};
    acc[rowIndex]![colIndex] = { code: val.coordinate, rowIndex, colIndex };
    return acc;
}, {} as NumberDictionary<NumberDictionary<ChessCoordinate>>);

export const calcChessCoordinateByCode = (coordCode: ChessCoordinateCode) => {
    return _chessCoordinateCodeMap[coordCode];
};

export const calcChessCoordinate = (rowIndex: number, colIndex: number, validate: boolean = false) => {
    return _chessCoordinateIndexMap[rowIndex]?.[colIndex] ?? (validate ? throwExpression('Invalid chessBoard index') : undefined);
};

export function initBoardMatrix(): ChessBoardMatrix {
    const boardMatrix: ChessBoardMatrix = [...Array(8)].map((_, i) => [...Array(8)].map((_, j) => new ChessSquare(i, j, chessBoardMatrixDict[calcChessCoordinate(i, j, true)!.code]?.piece)));
    return boardMatrix;
}
