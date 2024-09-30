import {
  Box,
  Button,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  GlobalStyles,
  Switch,
} from '@mui/material'
import type { ChangeEvent } from 'react'
import { StoreProvider } from '~/contexts/StoreContext'
import { useAppDispatch, useAppSelector } from '~/store'
import { reset, selectTypes, setTypes } from '~/store/settings'

const App = () => {
  const types = useAppSelector(selectTypes)
  const dispatch = useAppDispatch()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.currentTarget
    dispatch(setTypes({ ...types, [value]: checked }))
  }

  const handleClickReset = () => dispatch(reset())

  return (
    <Box sx={{ m: 1 }}>
      <FormGroup sx={{ flexDirection: 'row', mx: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Switch
                checked={types.guest}
                onChange={handleChange}
                value="guest"
              />
            }
            label="Guest"
          />
          <FormControlLabel
            control={
              <Switch
                checked={types.member}
                onChange={handleChange}
                value="member"
              />
            }
            label="Member"
          />
          <FormControlLabel
            control={
              <Switch
                checked={types.moderator}
                onChange={handleChange}
                value="moderator"
              />
            }
            label="Moderator"
          />
          <FormControlLabel
            control={
              <Switch
                checked={types.owner}
                onChange={handleChange}
                value="owner"
              />
            }
            label="Owner"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Switch
                checked={types['super-chat']}
                onChange={handleChange}
                value="super-chat"
              />
            }
            label="Super Chat"
          />
          <FormControlLabel
            control={
              <Switch
                checked={types['super-sticker']}
                onChange={handleChange}
                value="super-sticker"
              />
            }
            label="Super Sticker"
          />
          <FormControlLabel
            control={
              <Switch
                checked={types.membership}
                onChange={handleChange}
                value="membership"
              />
            }
            label="Membership"
          />
        </Box>
      </FormGroup>
      <Button fullWidth onClick={handleClickReset} size="small">
        Reset
      </Button>
    </Box>
  )
}

const Popup = () => {
  return (
    <StoreProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { overflowY: 'hidden', width: 330 },
        }}
      />
      <App />
    </StoreProvider>
  )
}

export default Popup
