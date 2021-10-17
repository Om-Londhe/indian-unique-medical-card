import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import React, { forwardRef, Ref } from "react";
import filterStyles from "../../../styles/components/gov/Filter.module.css";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FilterProps {
  open: boolean;
  setOpen: Function;
  frequencyFilter: string;
  setFrequencyFilter: Function;
  cityFilter: string;
  setCityFilter: Function;
  stateFilter: string;
  setStateFilter: Function;
}

const Filter = ({
  open,
  setOpen,
  frequencyFilter,
  setFrequencyFilter,
  cityFilter,
  setCityFilter,
  stateFilter,
  setStateFilter,
}: FilterProps) => {
  const close = () => setOpen(false);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={close}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {"Filter citizens"}
      </DialogTitle>
      <DialogContent>
        <div className={filterStyles.selectionField}>
          <label htmlFor="frequencyFilter">Select frequency of data</label>
          <select
            id="frequencyFilter"
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className={filterStyles.filter}
          >
            <option value="monthly">Monthly</option>
            <option value="3months">3 Months</option>
            <option value="6month">6 Months</option>
            <option value="yearly">Yearly</option>
            <option value="lifetime">Lifetime</option>
          </select>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Filter;
