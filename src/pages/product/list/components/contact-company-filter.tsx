import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useSearchParams } from 'react-router-dom';
import { listSupliers } from '../../../../services/products';
import './styles.css';

const FilterByContact = () => {

  const [contact, setContact] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadOptions = (inputValue: string, callback: (options: any[]) => void) => {
    const query = { query: { search: inputValue || '' } };
    listSupliers(query)
      .then(({ data }) => {
        const contactId = searchParams.get('contact') || '';
        const [defaultOption] = (data?.results || []).filter((o: any) => o?.id === parseInt(contactId, 10));
        if (defaultOption && contactId)
          setContact(defaultOption)
        callback(data?.results || []);
      })
      .catch(err => console.debug(err));
  };

  const ContactsOptions = (props: any) => {
    const { innerProps, innerRef, data } = props;

    return (
      <div
        ref={innerRef} {...innerProps}
        className={`custom-option ${props?.isSelected ? 'selected_option' : ''}`}>
        <label className='option_title'>{data?.code}</label>
        <div className="sub">{`Company: ${data?.company_name}`} </div>
      </div>
    );
  };
  const handleChangeContact = (contact: any) => {
    setContact(contact);
    if (contact?.id) {
      searchParams.set('contact', contact?.id);
    }
    else {
      searchParams.delete('contact');
    }
    setSearchParams(searchParams)
  }

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      isClearable
      loadOptions={loadOptions}
      getOptionLabel={o => o.company_name}
      getOptionValue={o => o?.id}
      value={contact || null}
      onChange={handleChangeContact}
      components={{ Option: ContactsOptions }}
      placeholder='Please select a contact'
    />
  )
};

export default FilterByContact;


