import { ChessBoardMatrix } from '@/models/chess/ChessBoardMatrix';
import { ChessCheck } from '@/models/chess/ChessCheck';
import { ChessMove } from '@/models/chess/ChessMove';
import { ChessPieceColor, ChessPieceName } from '@/models/chess/ChessPieceType';
import { ChessSquare } from '@/models/chess/ChessSquare';
import { EnumDictionary } from '@/utils';
import memoize from 'memoizee';

export class ChessBoardSnapshot {
    playingColor: ChessPieceColor;
    matrix: ChessBoardMatrix;

    move?: ChessMove;

    check?: ChessCheck;

    constructor(playingColor: ChessPieceColor, matrix: ChessBoardMatrix) {
        this.playingColor = playingColor;
        this.matrix = matrix;
    }

    // Accessors

    piecesIndex = () => this.piecesIndexFn(this.matrix);
    private piecesIndexFn = memoize((matrix: ChessBoardMatrix) => matrix.flat().filter(e => e.piece != null).reduce((acc, val) => {
        return { ...acc, [val.piece!.getName()]: val };
    }, {} as EnumDictionary<ChessPieceName, ChessSquare>), { primitive: true, max: 1 });

    // Utils

    toString() { // Needed for memoize
        return `${this.move}`;
    }
}
