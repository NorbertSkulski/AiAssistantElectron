

import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const CustomInput = (props) => {
    const {name, label, field} = props;

return <div className="MainInput">
        <Field>
            <FieldLabel htmlFor={`input-${name}`}>{label}</FieldLabel>
            <Input id={`input-${name}`} {...field} {...props} />
            {/* <FieldDescription>
                Your API key is encrypted and stored securely.
            </FieldDescription> */}
        </Field>
    </div>
}

export default CustomInput;