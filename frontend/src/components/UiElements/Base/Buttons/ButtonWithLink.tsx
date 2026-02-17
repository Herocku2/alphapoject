import React from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

type ButtonWithLinkProps = {
    link: string;
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; // Corrected here
}

const ButtonWithLink: React.FC<ButtonWithLinkProps> = ({ link, label, onClick }) => {
    return (
        <InputGroup className="mb-3">
            <FormControl
                placeholder="Enter something"
                aria-label="Input field"
                value={link}
                readOnly
            />
            <Button
                variant="outline-secondary"
                onClick={onClick}
            >
                {label}
            </Button>
        </InputGroup>
    );
}

export default ButtonWithLink;
