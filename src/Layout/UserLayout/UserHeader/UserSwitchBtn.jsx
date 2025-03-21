import * as React from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Link } from 'react-router-dom';

function UserSwitchBtn(){
    return(
        <FormControl component="fieldset">
        <FormGroup aria-label="position" row>
          <FormControlLabel
          sx={{color:'white'}}
            value="bottom"
            control={<Link to={"Admin-DashboardAdmin"}><Switch color="primary" /></Link>}
            label="User"
            labelPlacement="bottom"
          />
        </FormGroup>
      </FormControl>
    )
}

export default UserSwitchBtn