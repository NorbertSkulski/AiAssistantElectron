import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const MainInput = (props) => {
    const {name, label} = props;
    return <div className="MainInput">
        <Field>
            <FieldLabel htmlFor={`input-${name}`}>{label}</FieldLabel>
            <Input id={`input-${name}`} {...props} />
            {/* <FieldDescription>
                Your API key is encrypted and stored securely.
            </FieldDescription> */}
        </Field>
    </div>
}

export default MainInput;
