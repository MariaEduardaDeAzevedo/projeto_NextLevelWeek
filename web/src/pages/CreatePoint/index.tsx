import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css'
import { FiArrowLeft } from 'react-icons/fi'
import logo from '../../assets/logo.svg'
import {Link, useHistory} from 'react-router-dom'
import {Map, TileLayer, Marker} from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import axios from 'axios';
import DropZone from '../../components/Dropzone'

/**
 * Componente da página de cadastro
 */

//Tipagem de um item
interface Item {
    id : number;
    title: string;
    image_url : string;
}

//Tipagem de um estado
interface IBGEUFResponse {
    sigla: string;
}

//Tipagem de uma cidade
interface IBGECityResponse {
    nome: string;
}

//Componente
const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]); //Estado de item
    const [ufs, setUFs] = useState<string[]>([]); //Estado de UF
    const [cities, setCities] = useState<string[]>([]); //Estado de cidade
    const [selectedUF, setSelectedUF] = useState('0'); //Estado de UF selecionada
    const [selectedCity, setSelectedCity] = useState('0'); //Estado de cidade selecionada
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]); //Estado de localização selecionada
    const [initialPosition, setInitialPosition] = useState<[number, number]>([-7.2428376,-35.9015644]); //Estado de localização inicial
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    }) //Estado de envio de formulário
    const [selectedItems, setSelectedItems] = useState<number[]>([]); //Estado de itens selecionados
    const [selectedFile, setSelectedFile] = useState<File>();
    const history = useHistory(); 

    //Pegando posição inicial no mapa
    useEffect (() => {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setInitialPosition([lat, lng]);
        })
    });
    
    //Carregando os items da nossa API
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    },[]);

    //Carregando as UFs da API de localidades do IBGE
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitial = response.data.map(uf => uf.sigla);
            setUFs(ufInitial);
        });
    }, []);

    //Pegando cidades da UF selecionada
    useEffect(() => {
        if (selectedUF === '0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
        .then(response => {
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
        });
    }, [selectedUF]);


    //Seleciona UF
    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value; //Pega estado selecionado
        setSelectedUF(uf); //Guarda o estado selecionado
    }

    //Seleciona cidade
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value; //Pega cidade selecionada
        setSelectedCity(city); //Guarda cidade selecionada
    }

    //Seleciona posição do mapa
    function handleMapClick(event: LeafletMouseEvent) {
        const lat = event.latlng.lat //Pega o valor da latitude
        const lng = event.latlng.lng //Pega o valor da longitude

        setSelectedPosition([lat, lng]); //Guarda localização
    }

    //Guarda valores do formulário
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {        
        const { name, value } = event.target; //Pega valores do formulário
        setFormData({...formData, [name]: value}) //Guarda os dados pegos do formulário
    }

    //Seleciona itens
    function handleSelectItem(id:number) {
        const alredySelected = selectedItems.findIndex(item => item === id); 

        if (alredySelected > -1) { //Verifica se o item já foi selecionadp
            const filteredItems = selectedItems.filter(item => item !== id); //Retira item clicado
            setSelectedItems(filteredItems); //Guarda itens selecionados
        } else {
            setSelectedItems([...selectedItems, id]); //Seleciona e guarda novo item
        }
    }

    //Envia formulário
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const {name, email, whatsapp} = formData; //Pega dados pessoais
        ///// Pega dados de localização /////
        const uf = selectedUF; 
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        //////////////////////////////////////
        const items = selectedItems; //Pega itens selecionados

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('city', city);
        data.append('uf', uf);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            await api.post('points', data); //Cria novo point no banco de dados
            alert(`Ponto de coleta ${name} cadastrado com sucesso!`);
        } catch {
            alert("Ops... :(\nAlgo deu errado ao realizar o cadastro,\nconfira se preencheu todos os campos e tente novamente.") //Exibe um alert caso não haja erros
        } 

        history.push("/"); //Retorna pra a página inicial
    }

    return (
        <div id="page-create-point">
           <header>
            <img src={ logo } alt="Ecoleta"/>
            <Link to="/">
                <FiArrowLeft />
                Voltar para a página inicial
            </Link>
           </header>

           <form onSubmit = { handleSubmit }>
                <h1>Cadastro do ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Imagem</h2>
                        <span>Carregue uma imagem que identifique o ponto de coleta</span>
                        <DropZone onFileUploaded={setSelectedFile}/>
                    </legend>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                        <span>Dados de contato e identificação do ponto</span>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input onChange={ handleInputChange } type="text" name="name" id="name"/>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input onChange={ handleInputChange } type="email" name="email" id="email"/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input onChange={ handleInputChange } type="tel" name="whatsapp" id="whatsapp"/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione a localização do ponto no mapa</span>
                    </legend>

                    <Map center={ initialPosition } zoom={15} onClick= { handleMapClick } >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={ selectedPosition }/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="UF">UF</label>
                            <select onChange={ handleSelectUF } value={ selectedUF } name="uf" id="uf">
                                <option value="0">Selecione o estado</option>
                                {ufs.map(uf =>( 
                                        <option key={ uf } value={ uf } > { uf } </option>
                                    )
                                )};
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select onChange={ handleSelectCity } value={ selectedCity } name="city" id="city">
                                <option value="0">Selecione a cidade</option>
                                {cities.map(city =>( 
                                        <option key={ city } value={ city } > { city } </option>
                                    )
                                )};
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => 
                        <li key={ item.id } onClick={ () => handleSelectItem(item.id) }
                        className={selectedItems.includes(item.id) ? 'selected' : ''} >
                            <img src={ item.image_url } alt= {item.image_url} ></img>
                            <span>{ item.title }</span>
                        </li>)}
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
           </form> 
        </div>
    );
}

export default CreatePoint;