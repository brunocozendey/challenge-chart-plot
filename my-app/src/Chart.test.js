import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Chart from './Chart';

describe('Chart', () => {
  it('renders the chart with default data', () => {
    const { getByTestId } = render(<Chart />);
    const chart = getByTestId('canvas');
    expect(chart).toBeInTheDocument();
  });

  it('updates chart data when text area value changes', () => {
    const { getByTestId, getByLabelText } = render(<Chart />);
    const textArea = getByLabelText('input-events');
    fireEvent.change(textArea, { target: { value: `{"type":"data", "name": "test", "start_value": 10, "stop_value": 20}` } });
    fireEvent.submit(getByTestId('form'));

    const chart = getByTestId('chart');
    expect(chart).toBeInTheDocument();
  });
});