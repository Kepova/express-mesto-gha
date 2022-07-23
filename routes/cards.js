const CardsRouter = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

CardsRouter.get('/cards', getCards); // возвращает все карточки
CardsRouter.post('/cards', createCard); // создаёт карточку
CardsRouter.delete('/cards/:cardId', deleteCard); // удаляет карточку
CardsRouter.put('/cards/:cardId/likes', likeCard); // поставить лайк карточке
CardsRouter.delete('/cards/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = CardsRouter;
