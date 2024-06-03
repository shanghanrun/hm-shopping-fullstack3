import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import productStore from '../store/productStore'
import { prices } from '../constants/prices.constants';


function PriceDropdown() {
  const {setProducts, productList, initialProductList} = productStore()
  // console.log('priceDropdown의 productList', productList)
  // console.log('priceDropdown의 initialProductList', initialProductList)
  const iList = [...initialProductList]

  function filterByPrice(price){
    let pr1, pr2;
    if (price ==='1만원 이하'){
      pr1= 0 ; pr2=10000
    } else if(price ==='만원~2만원'){
      pr1= 10000; pr2 = 20000
    } else if(price ==='2만원~3만원'){
      pr1=20000; pr2 = 30000
    } else if(price ==='3만원 이상'){
      pr1= 30000; pr2 = 10000000
    } else if(price ==='모두'){
      pr1=0; pr2 =1000000000
    }
    const results = iList.filter(product => 
      product.price >= pr1 && product.price <=pr2)
      console.log('가격 검색 result ', results)
    setProducts(results)
  }
  return (
    <Dropdown>
      <Dropdown.Toggle variant="danger" id="dropdown-basic">
        Price
      </Dropdown.Toggle>

      <Dropdown.Menu style={{background: '#211e1e'}}>
              {prices.map((price, index) => (
                <Button style={{marginRight:"3px", marginBottom:"3px" }} 
					onClick={()=>filterByPrice(price)} key={index} >{price}</Button>
              ))}
        </Dropdown.Menu>
    </Dropdown>
  );
}

export default PriceDropdown;
