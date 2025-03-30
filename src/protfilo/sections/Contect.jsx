import {useAppContext} from '../context/AppContext'
const Contect = () => {
    const {setIsMobile} = useAppContext();
    return (
        <div>
            <h1>Contect</h1>
            <button onClick={() => setIsMobile(true)}>mmmm</button>
        </div>
    )
}   

export default Contect