import React from 'react';
import { Form } from 'react-bootstrap';

export default function Settings() {
    return (
        <>
            <p>Settings</p>
            <Form>
                <Form.Check 
                    type="switch"
                    id="custom-switch"
                    className="custom-switch"
                    label="Dark Mode"
                />
            </Form>
        </>
    )
}