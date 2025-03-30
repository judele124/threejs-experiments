import {useAppContext} from '../context/AppContext'
const Section = (props) => {
    const { children } = props;

    return <section
        className={`h-screen w-full p-8 
         mx-auto flex flex-col 
        justify-center items-start`}
    >{children}</section>
}


const Interface = () => {
    const isMobile = useAppContext();
    console.log(isMobile);
    
 
    
    return (
        <div className="absolute top-0 flex flex-col items-center w-full text-white">
            <Section>
                <h1 className="text-4xl font-bold mb-8">about</h1>
            </Section>
            <Section>
                <h1 className="text-4xl font-bold mb-8">projects</h1>
            </Section>
            <Section>
                <h1 className="text-4xl font-bold mb-8">skills</h1>
            </Section>
            <Section>
                <h1 className="text-4xl font-bold mb-8">contact</h1>
            </Section>
        </div>
    )
}

export default Interface