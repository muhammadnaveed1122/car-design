import { Grid, Button, TextInput, Flex, Group, Loader, Box } from "@mantine/core";
import Select from "react-select";

function Form({ handleVerfication, cardInfo, handleCardDetailsChange, errors, updatedCities, updatedStates, setCardInfo, updatedCountries, router, onClose, loader, setShow1 }) {
    return (
        <form className="payment-form" onSubmit={handleVerfication}>
            <Grid grow>
                <Grid.Col span={12}>
                    <TextInput
                        label="Name on Card"
                        name="userName" placeholder="John Smith"
                        value={cardInfo.userName}
                        onChange={(e) => handleCardDetailsChange('userName', e.target.value)}
                        required
                    />
                    {errors?.userName && <span style={{ color: "red" }}>{errors?.userName}</span>}
                </Grid.Col>
                <Grid.Col span={12}>
                    <TextInput
                        id="cardDetailsMMYY"
                        label="Card Details"
                        placeholder="xxxx-xxxx-xxxx-xxxx"
                        value={cardInfo.cardNumber}
                        onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}
                        required
                    />
                    {errors?.cardNumber && <span style={{ color: "red" }}>{errors?.cardNumber}</span>}

                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        id="expireDate"
                        placeholder="MM/YY"
                        radius="sm"
                        name="expireDate"
                        value={cardInfo.expireDate}
                        onChange={(e) => handleCardDetailsChange('expireDate', e.target.value)}
                        required
                    />
                    {errors?.expireDate && <span style={{ color: "red" }}>{errors?.expireDate}</span>}

                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        type="number"
                        id="cardDetailsCVC"
                        placeholder="CVC"
                        radius="sm"
                        maxLength={4}
                        value={cardInfo.cvc}
                        name="cvc"
                        onChange={(e) => handleCardDetailsChange('cvc', e.target.value)}
                        required
                    />
                    {errors?.cvc && <span style={{ color: "red" }}>{errors?.cvc}</span>}

                </Grid.Col>
                <Grid.Col span={12}>
                    <TextInput
                        id="address"
                        label="Address Line 1"
                        placeholder="Address"
                        radius="sm"
                        name="address"
                        value={cardInfo.address}
                        onChange={(e) => handleCardDetailsChange('address', e.target.value)}
                        required
                    />
                    {errors?.address && <span style={{ color: "red" }}>{errors?.address}</span>}
                </Grid.Col>
                <Grid.Col span={12}>
                    <TextInput
                        id="Country"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Country"
                        // styles={customStyles}
                        // options={updatedCountries}
                        value={cardInfo.country.name}
                        onChange={(value) => {
                            setCardInfo(prevCardDetails => ({
                                ...prevCardDetails,
                                country: value,
                                state: null, city: 'null'
                            }));
                        }}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: 'black',

                            },
                        })}
                        readOnly
                    />
                    {errors?.country && <span style={{ color: "red" }}>{errors?.country}</span>}
                </Grid.Col>
                <Grid.Col span={{ xs: 4 }}>
                    <Select
                        id="State"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="State"
                        options={updatedStates(cardInfo.country ? cardInfo?.country?.isoCode : null)}
                        value={cardInfo.state}
                        onChange={(value) => {
                            setCardInfo(prevCardDetails => ({
                                ...prevCardDetails,
                                state: value, city: null
                            }));
                        }}
                        required
                    />
                    {errors?.state && <span style={{ color: "red" }}>{errors?.state}</span>}

                </Grid.Col>
                <Grid.Col span={{ xs: 4 }}>
                    <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        id="city"
                        name="city"
                        placeholder="City"
                        options={cardInfo.state ? updatedCities(cardInfo.state.countryCode, cardInfo.state.isoCode) : updatedCities(null)}
                        value={cardInfo.city}
                        onChange={(value) => {
                            setCardInfo(prevCardDetails => ({
                                ...prevCardDetails,
                                city: value
                            }));
                        }} />

                    {errors?.city && <span style={{ color: "red" }}>{errors?.city}</span>}

                </Grid.Col>
                <Grid.Col span={{ xs: 4 }}>
                    <TextInput
                        id="zip"
                        placeholder="Zip Code"
                        radius="sm"
                        value={cardInfo.zipcode}
                        name="zipcode"
                        required
                        onChange={(e) => handleCardDetailsChange('zipcode', e.target.value)}
                    />
                    {errors?.zipcode && <span style={{ color: "red" }}>{errors?.zipcode}</span>}

                </Grid.Col>
                <Grid.Col span={6}>
                    {!loader ?
                        <Button type="submit" id="submit" variant="filled" fullWidth >
                            Submit
                        </Button>
                        :
                        <Button variant="filled" fullWidth align='center' className="submitLoader">
                            <Loader />
                        </Button>
                    }
                </Grid.Col>
                <Grid.Col span={6}>
                    <Button
                        // onClick={() => { setShow1(false) }}
                        onClick={() => {onClose()}}
                        variant="filled" color="#7E7E7E" fullWidth>
                        I'll do it later
                    </Button>
                </Grid.Col>
            </Grid>
        </form>
    )
}

export default Form