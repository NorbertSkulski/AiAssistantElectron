import { Button } from "@/components/ui/button";
import settingsDb from "@/react/apis/indexedDb/settingsDb";
import CustomInput from "@/react/components/inputs/customInput/CustomInput";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

const SettingsForm = () => {

    const [initialValues,setInitialValues] = useState({
        GeminiApiKey:"",
        GeminiApiModel:"",
        GeminiApiSysInst:"",
    });

    const onSubmit = async (values) => {
        
        try{
            if(!values?.GeminiApiKey || !values?.GeminiApiModel){
                throw "Fill in all required fields!";
            }
           
            const GEMINI_API_KEY = await settingsDb.settings.get({ key: 'GEMINI_API_KEY' });
            if(GEMINI_API_KEY){
                await settingsDb.settings.update(GEMINI_API_KEY.id, { value: values?.GeminiApiKey });
            } else {
                await settingsDb.settings.add({ key: 'GEMINI_API_KEY', value:  values?.GeminiApiKey });
            }
            const GEMINI_API_MODEL = await settingsDb.settings.get({ key: 'GEMINI_API_MODEL' });
            if(GEMINI_API_MODEL){
                await settingsDb.settings.update(GEMINI_API_MODEL.id, { value: values?.GeminiApiModel });
            } else {
                await settingsDb.settings.add({ key: 'GEMINI_API_MODEL', value: values?.GeminiApiModel });
            }
            const GEMINI_API_SYS_INST = await settingsDb.settings.get({ key: 'GEMINI_API_SYS_INST' });
            if(GEMINI_API_SYS_INST){
                await settingsDb.settings.update(GEMINI_API_SYS_INST.id, { value: values?.GeminiApiSysInst });
            } else {  
                await settingsDb.settings.add({ key: 'GEMINI_API_SYS_INST', value:  values?.GeminiApiSysInst });
            }            
        } catch(e){
            toast.error("Error saving settings: "+e);
            return;
        }
       
        toast.success("Settings Saved!");
    }

    const loadSettings = async () => {
        const GEMINI_API_KEY = await settingsDb.settings.get({ key: 'GEMINI_API_KEY' });
        const GEMINI_API_MODEL = await settingsDb.settings.get({ key: 'GEMINI_API_MODEL' });
        const GEMINI_API_SYS_INST = await settingsDb.settings.get({ key: 'GEMINI_API_SYS_INST' });

        setInitialValues({
            GeminiApiKey:GEMINI_API_KEY?.value || "",
            GeminiApiModel:GEMINI_API_MODEL?.value || "",
            GeminiApiSysInst:GEMINI_API_SYS_INST?.value || "",
        });
    }

    useEffect(()=>{
       loadSettings();    
    },[])


    return <div>
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            enableReinitialize={true}
        >
            {({ handleSubmit }) => <form onSubmit={handleSubmit}>
            
                <Field className="mb-2" name="GeminiApiKey" label="Gemini Api Key*"  component={CustomInput}/>
                <Field className="mb-2"  name="GeminiApiModel" label="Gemini Api Model*"  component={CustomInput}/>
                <Field className="mb-2"  name="GeminiApiSysInst" label="Gemini Api System Instruction"  component={CustomInput}/>

                <Button type="submit">Save</Button>
            </form>}
        </Formik>
    </div>
}

export default SettingsForm;