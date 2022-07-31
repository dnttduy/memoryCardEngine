import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from '@lodash';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import DfinityAgentService from './services/dfinityAgentService';

import { AuthClient } from '@dfinity/auth-client';
import { canisterId, createActor } from "../../../../declarations/sustainations_dao";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuthClient = async () => {
      const client = await AuthClient.create();
      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated); //check isAuthorized first time
      if (authenticated) {
        const identity = client.getIdentity();
        const actor = createActor(canisterId, {
          agentOptions: {
            identity
          }
        });
        const principal = identity.getPrincipal().toText();
        const result = await actor.getUserInfo();
        let brandRole = [];
        if (_.findKey(result?.ok?.brandRole, 'owner')) {
          brandRole = ['brandOwner'];
        }
        if (_.findKey(result?.ok?.brandRole, 'staff')) {
          brandRole = ['brandStaff'];
        }
        dispatch(setUser({
          role: result?.ok?.agreement ? _.union(_.keys(result?.ok?.role), brandRole) : ['needAgreement'],
          actor,
          depositAddress: result?.ok?.depositAddress,
          balance: result?.ok?.balance,
          principal,
          brandId: result?.ok?.brandId,
        }));
        setWaitAuthCheck(false);
      } else {
        pass();
      }
    }

    const resetAuthClient = async () => {
      const client = await AuthClient.create();
      await client.logout();
    };

    initAuthClient();

    DfinityAgentService.on('onLogin', (message) => {
      success(message);
    });

    DfinityAgentService.on('onLogout', (message) => {
      pass(message);
      dispatch(logoutUser());
    });

    function success(message) {
      setWaitAuthCheck(true);
      Promise.all([
        initAuthClient(),
      ]).then(() => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
        if (message) {
          dispatch(showMessage({ message }));
        }
      });
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }
      Promise.all([
        resetAuthClient(),
      ]).then(() => {
        setWaitAuthCheck(false);
        setIsAuthenticated(false);
      });
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
