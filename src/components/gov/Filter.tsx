import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { Autocomplete } from "@material-ui/lab";
import { City, State } from "country-state-city";
import { ICity, IState } from "country-state-city/dist/lib/interface";
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
  cityFilter: ICity | null;
  setCityFilter: Function;
  stateFilter: IState | null;
  setStateFilter: Function;
}

interface FrequencyFilterType {
  name: string;
  value: string;
}

const frequencyFilterOptions = [
  { value: "monthly", name: "Monthly" },
  { value: "3months", name: "3 Months" },
  { value: "6month", name: "6 Months" },
  { value: "yearly", name: "Yearly" },
  { value: "lifetime", name: "Lifetime" },
];

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      fullWidth
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      onClose={close}
    >
      <DialogTitle id="alert-dialog-slide-title">
        {"Filter citizens"}
      </DialogTitle>
      <DialogContent>
        <div className={filterStyles.selectionField}>
          <Autocomplete
            options={frequencyFilterOptions}
            getOptionLabel={(option: FrequencyFilterType) => option.name}
            value={
              frequencyFilterOptions.filter(
                (filter) => filter.value === frequencyFilter
              )[0]
            }
            onChange={(event: any, newValue: FrequencyFilterType | null) => {
              setFrequencyFilter(newValue?.value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Filter by frequency"
                type="text"
                fullWidth
                variant="standard"
                color="secondary"
              />
            )}
          />
        </div>
        <div className={filterStyles.selectionField}>
          <Autocomplete
            options={State.getStatesOfCountry("IN")}
            getOptionLabel={(option: IState) => option.name}
            value={stateFilter}
            onChange={(event: any, newValue: IState | null) => {
              setStateFilter(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Filter by state"
                type="text"
                fullWidth
                variant="standard"
                color="secondary"
              />
            )}
          />
        </div>
        {stateFilter ? (
          <div className={filterStyles.selectionField}>
            <Autocomplete
              options={City.getCitiesOfState("IN", stateFilter?.isoCode)}
              getOptionLabel={(option: ICity) => option.name}
              value={cityFilter}
              onChange={(event: any, newValue: ICity | null) => {
                setCityFilter(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Filter by city"
                  type="text"
                  fullWidth
                  variant="standard"
                  color="secondary"
                />
              )}
            />
          </div>
        ) : (
          <></>
        )}
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
