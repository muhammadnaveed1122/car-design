import { carStatus, initialPriceRange, initialMileRange } from '@/constants/data';
import { defaultDescription } from '@/constants/data';
import { generateString } from '@/helpers';
import { faker } from '@faker-js/faker';
import { DataTypes } from 'sequelize';
import moment from 'moment/moment';

export { carModel, fakeCar };

function carModel(sequelize) {
  const attributes = {
    images: { type: DataTypes.TEXT('long'), allowNull: false, defaultValue: '[]' },
    year: { type: DataTypes.INTEGER, allowNull: true },
    make: { type: DataTypes.STRING, allowNull: true },
    model: { type: DataTypes.STRING, allowNull: true },
    fakeName: { type: DataTypes.STRING, allowNull: true },
    vin: { type: DataTypes.STRING, allowNull: true },
    lot: { type: DataTypes.STRING, allowNull: true },
    color: { type: DataTypes.STRING, allowNull: true },
    engine: { type: DataTypes.STRING, allowNull: true },
    doors: { type: DataTypes.INTEGER, allowNull: true },
    seats: { type: DataTypes.INTEGER, allowNull: true },
    mileage: { type: DataTypes.INTEGER, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: true },
    transmission: { type: DataTypes.STRING, allowNull: true },
    bidPrice: { type: DataTypes.INTEGER, allowNull: true },
    bidDeadline: { type: DataTypes.DATE, allowNull: true },
    bidCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    invoiceSent: { type: DataTypes.DATE, allowNull: true },
    referal: { type: DataTypes.STRING, allowNull: true },
    specs: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM(...carStatus), allowNull: false, defaultValue: carStatus[0] },
    pdf: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    purchaseSteps: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isTrash: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    initialBidPrice: { type: DataTypes.INTEGER, allowNull: true },
    winBox: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    autoBid: { type: DataTypes.JSON, allowNull: true, defaultValue: null },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    companyName: { type: DataTypes.STRING, allowNull: true },
    companyImage: { type: DataTypes.TEXT('long'), allowNull: true, defaultValue: '' },
    bodyStyle: { type: DataTypes.STRING, allowNull: true },
    fuelType: { type: DataTypes.STRING, allowNull: true },
    driveType: { type: DataTypes.STRING, allowNull: true },
    bodyStyle: { type: DataTypes.STRING, allowNull: true },
    cylinders: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    isPending: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    vehicleType:{type:DataTypes.STRING, allowNull: true},
    driveSide:{type:DataTypes.STRING, allowNull: true}
  };

  const options = {
    defaultScope: {
      attributes: {}
    },
    scopes: {
    },
  };

  return sequelize.define('Car', attributes, options);
}

const makes = ['BMW', 'Audi', 'Merdedes', 'Ford', 'Honda', 'Luxury', 'Kia', 'Toyota', 'Jeep', 'GMC', 'Mazda', 'Volvo', 'Subaru', 'Hyundai'];
const models = ['A-Class', 'A3', 'A4', 'A4 allroad', null];
const colors = ['Red', 'Black', 'White', 'Gray', 'Blue'];
const curYear = new Date().getFullYear();

function fakeCar(isTarget = false) {
  let imgs = [];
  for (let i = 1; i <= 7; ++i)
    imgs.push(`/assets/cars/car${i}.jpg`);
  const data = {
    images: JSON.stringify(imgs.sort((a, b) => Math.random() - 0.5)),
    year: curYear - Math.floor(Math.random() * 10),
    price: faker.number.int({ min: initialPriceRange[0], max: initialPriceRange[1] }),
    mileage: faker.number.int({ min: initialMileRange[0], max: initialMileRange[1] }),
    make: makes[Math.floor(Math.random() * makes.length)],
    model: models[Math.floor(Math.random() * models.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    vin: generateString(),
    lot: generateString(),
    seats: 4,
    doors: 4,
    engine: generateString(6),
    transmission: 'Auto',
    status: "LIVE",
    bidPrice: initialPriceRange[0],
    initialBidPrice: initialPriceRange[0],
    bidDeadline: new Date(moment(new Date()).subtract(-faker.number.int({ min: 2, max: 10 }), 'days')),
    specs: defaultDescription,
    referal: isTarget ? generateString() : null,
    pdf: '',
    winBox: false,
    autoBid: null,
    slug: generateString(5),
    isPending: true
  };

  return data;
}