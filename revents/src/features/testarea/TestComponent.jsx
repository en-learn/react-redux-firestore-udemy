import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  data: state.data,
});

const TestComponent = props => {
  return (
    <div>
      <h1>Test Component</h1>
      <h3>The answer is: {props.data}</h3>
    </div>
  );
};

export default connect(mapStateToProps)(TestComponent);
