import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import SearchBox from "../components/SearchBox";
import productStore from '../store/productStore'
import uiStore from '../store/uiStore'
import NewItemDialog from "../components/NewItemDialog";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import ProductTable from "../components/ProductTable";
import orderStore from '../store/orderStore'
import userStore from '../store/userStore'

const AdminProduct = () => {
    const {productList, getProductList, totalPage, setSelectedProduct, deleteProduct, totalProductCount, selectedProduct, batchCreateProducts, productUpdated, openPopup,emptyNewProductList } = productStore()
    const {getUserList} = userStore()
  const {getAllUserOrderList} = orderStore()
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);


  const [searchQuery, setSearchQuery] = useState({
    page: 1,name: ""})

  const [mode, setMode] = useState("new");
  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  useEffect(()=>{
    getAllUserOrderList() //order 페이지를 위해 미리 데이터를 로딩해 둔다.
    getUserList() // AdminAccount를 위해 미리
  },[])

  //상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(()=>{
    getProductList(searchQuery)
    if(searchQuery.name === ''){
      delete searchQuery.name;
    }
    const searchParamsString = new URLSearchParams(searchQuery).toString();
    navigate("?" + searchParamsString )
  },[searchQuery, selectedProduct, productUpdated])


  const deleteItem = async (id) => {
    //아이템 삭제하가ㅣ
    await deleteProduct(id, navigate)
  };

  const openEditForm = (product) => {
    //edit모드로 설정하고
    // 아이템 수정다이얼로그 열어주기
    setMode('edit')
    setSelectedProduct(product)
    setShowDialog(true)
  };

  const handleClickNewItem = () => {
    //new 모드로 설정하고
    setMode('new')
    // 다이얼로그 열어주기
    setShowDialog(true)
  };

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    console.log('selected:', selected)
    setSearchQuery({...searchQuery, page:selected+1})
    //searchQuery가 바뀌면 useEffect실행된다.
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("파일을 선택해주세요.");
      return;
    }
    console.log('selectedFile :', selectedFile)

    const formData = new FormData();
    console.log('selectedFile :', selectedFile)
    formData.append('file', selectedFile);
    for (let [key, value] of formData.entries()) {
    console.log('store로 전송하는 formData: ', key, value);
}
    batchCreateProducts(formData, navigate)
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2" 
          style={{display:'flex', gap:'100px'}}
        >
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
          <Button variant="success" onClick={async()=> await openPopup()}>신상 보여주기</Button>
          <Button onClick={()=>emptyNewProductList()}>신상홍보제거</Button>

           <input type="file" onChange={handleFileChange} accept=".xlsx" />
          <Button variant="danger" onClick={handleUpload}>Add Items(batch)</Button>
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        <div style={{display:'flex', gap:'40px'}}>
          <h5>Total Products: {totalProductCount} 품목</h5>
          <h6>found current page Products: {productList?.length}개</h6>
        </div>

        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPage} //전체페이지
          forcePage={searchQuery.page -1} // 1페이지면 2임 여긴 한개씩 +1 해야함
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination display-center list-style-none"
          activeClassName="active"
        />
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        />
    </div>
  );
};

export default AdminProduct;
