import { ChessBoard } from '@/models/chess/ChessBoard';
import { ChessPieceColor, reverseChessPieceColor } from '@/models/chess/ChessPieceType';
import { sample, shuffle, sortBy } from 'lodash-es';

export class ChessBot {
    chessBoard: ChessBoard;
    botColor: ChessPieceColor;

    constructor(chessBoard: ChessBoard) {
        this.chessBoard = chessBoard;
        this.botColor = reverseChessPieceColor(chessBoard.playerColor);
    }

    move() {
        const moves = shuffle(this.chessBoard.getNextMoves(this.botColor));

        // const rndMove = moves[0];

        const favorAdvance = Math.random() > 0.65;

        const rndMove = sortBy(moves, move => {
            let score = 0;

            if (move.capture) score += move.capture.value * 1000;

            if (favorAdvance) {
                const isAdvance = Math.sign(move.targetCoordinate.rowIndex - move.originCoordinate.rowIndex) === Math.sign(move.piece.getDirection());
                if (isAdvance) score += 100;
            }

            return -score;
        })[0];

        this.chessBoard.movePiece(rndMove);

        return rndMove;
    }
}
