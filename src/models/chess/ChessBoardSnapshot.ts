import { ChessPieceColor, ChessPieceName } from '@/models/chess/ChessPieceType';
import { ChessSquare } from '@/models/chess/ChessSquare';
import { EnumDictionary } from '@/utils';

export type ChessBoardMatrix = ChessSquare[][];

export interface ChessBoardSnapshot {
    playingColor: ChessPieceColor;
    matrix: ChessBoardMatrix;
    piecesIndex: EnumDictionary<ChessPieceName, ChessSquare>;
}