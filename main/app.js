import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// Components
import App from 'components/App';
import ViewUser from 'components/users/View';
import FindUsers from 'components/users/Find';
import ViewButton from 'components/buttons/View';
import EditButton from 'components/buttons/Edit';
import EditPreset from 'components/presets/Edit';
import ForkButton from 'components/buttons/Fork';
import ViewPreset from 'components/presets/View';
import ForkPreset from 'components/presets/Fork';
import FindButtons from 'components/buttons/Find';
import FindPresets from 'components/presets/Find';
import UserAccount from 'components/users/Account';
import CreateButton from 'components/buttons/Create';
import CreatePreset from 'components/presets/Create';
import DeleteButton from 'components/buttons/Delete';
import DeletePreset from 'components/presets/Delete';
import AddPresetButton from 'components/presets/buttons/Add';
import EditPresetButton from 'components/presets/buttons/Edit';
import DocumentationList from 'components/documentation/List';
import ViewDocumentation from 'components/documentation/View';
import ViewPresetButtons from 'components/presets/buttons/View';
import PlacePresetButtons from 'components/presets/buttons/Place';
import PurchaseSubscription from 'components/users/Purchase';
import CreateButtonFromUserscript from 'components/buttons/CreateFromUserscript';

render((
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={FindButtons} />

      <Route path='buttons'>
        <IndexRoute component={FindButtons} />

        <Route path='create'>
          <IndexRoute component={CreateButton} />

          <Route
            path='from-userscript'
            component={CreateButtonFromUserscript}
          />
        </Route>
        
        <Route path=':button'>
          <IndexRoute component={ViewButton} />

          <Route path='edit' component={EditButton} />
          <Route path='fork' component={ForkButton} />
          <Route path='delete' component={DeleteButton} />
        </Route>
      </Route>

      <Route path='presets'>
        <IndexRoute component={FindPresets} />

        <Route path='create' component={CreatePreset} />
        
        <Route path=':preset'>
          <IndexRoute component={ViewPreset} />

          <Route path='edit' component={EditPreset} />
          <Route path='fork' component={ForkPreset} />
          <Route path='delete' component={DeletePreset} />

          <Route path='buttons'>
            <IndexRoute component={ViewPresetButtons} />

            <Route path='add' component={AddPresetButton} />
            <Route path='place' component={PlacePresetButtons} />
            <Route path=':button' component={EditPresetButton} />
          </Route>
        </Route>
      </Route>

      <Route path='users'>
        <IndexRoute component={FindUsers} />

        <Route path='account'>
          <IndexRoute component={UserAccount} />
          
          <Route path='purchase' component={PurchaseSubscription} />
        </Route>

        <Route path=':user' component={ViewUser} />
      </Route>

      <Route path='docs'>
        <IndexRoute component={DocumentationList} />

        <Route path='view' component={ViewDocumentation} />
      </Route>
    </Route>
  </Router>
), document.getElementById('app'));