import React, { Component } from "react";
import { connect } from "react-redux";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { incrementAsync, decrementAsync } from "./testActions";
import { Button } from "semantic-ui-react";
import TestPlaceInput from "./TestPlaceInput";
import SimpleMap from "./SimpleMap";
import { openModal } from "../modals/modalActions";

const mapStateToProps = state => ({
  data: state.test.data,
  loading: state.async.loading
});

const mapDispatchToProps = {
  incrementAsync,
  decrementAsync,
  openModal
};

class TestComponent extends Component {
  state = {
    latlng: {
      lat: 59.95,
      lng: 30.33
    }
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({ latlng: latLng }))
      .catch(error => console.error("Error", error));
  };

  render() {
    const {
      data,
      incrementAsync,
      decrementAsync,
      openModal,
      loading
    } = this.props;
    return (
      <div>
        <h1>Test Component</h1>
        <h3>The answer is: {data}</h3>
        <Button
          onClick={incrementAsync}
          positive
          content="Increment"
          loading={loading}
        />
        <Button
          onClick={decrementAsync}
          negative
          content="Decrement"
          loading={loading}
        />
        <Button
          onClick={() => openModal("TestModal", { data: 42 })}
          color="teal"
          content="Open Modal"
        />
        <br />
        <br />
        <TestPlaceInput selectAddress={this.handleSelect} />
        <br />
        <SimpleMap key={this.state.latlng.lat} latlng={this.state.latlng} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);
