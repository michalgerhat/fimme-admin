import React from 'react';
import { storiesOf } from '@storybook/react';
import LoginForm from '../LoginForm';
import { ContextProvider } from '../Context';

function Wrapper ()
{
    return (
        <ContextProvider>
            <LoginForm />
        </ContextProvider>
    );
}

storiesOf("Header", module)
    .add("default", () => <Wrapper />);