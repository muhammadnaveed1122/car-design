import { DataTypes } from 'sequelize';

export { paymentModel };

function paymentModel(sequelize) {
    const attributes = {
        userName: { type: DataTypes.STRING, allowNull: false },
        cardNumber: { type: DataTypes.NUMBER, allowNull: true },
        expireDate: { type: DataTypes.NUMBER, allowNull: true },
        cvc: { type: DataTypes.NUMBER, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
        zipcode: { type: DataTypes.STRING, allowNull: true },
        country: { type: DataTypes.STRING, allowNull: true },
        city: { type: DataTypes.STRING, allowNull: true },
        state: { type: DataTypes.STRING, allowNull: true },
        UserId: { type: DataTypes.STRING, allowNull: false },
        paymentResponse: { type: DataTypes.STRING, allowNull: false },

    };
    const options = {
        defaultScope: {
            attributes: {}
        },
        scopes: {
        },
        indexes: [
        ]
    };

    return sequelize.define('Payment', attributes, options);
}