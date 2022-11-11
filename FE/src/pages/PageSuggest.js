import React, {useEffect} from "react"
import Paging from "../Components/Paging";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './PageSuggest.scss';


const PageSuggest = () => {
  const navigate = useNavigate();
  const SERVER_URL = process.env.REACT_APP_BACK + 'Page-Suggest';
  const [islogin, setIslogin] = React.useState(false);
  const [items, setItems] = React.useState([]) //리스트에 나타낼 아이템
  const [count, setCount] = React.useState(0); //아이템 총 개수
  const [currentpage, setCurrentpage] = React.useState(1); //현재페이지
  const [postPerPage] = React.useState(5); //페이지당 아이템 개수

  const [indexOfLastPost, setIndexOfLastPost] = React.useState(0);
  const [indexOfFirstPost, setIndexOfFirstPost] = React.useState(0);
  const [currentPosts, setCurrentPosts] = React.useState(0);

  function elapsedTime(date){
    const start = new Date(date);
    const end = new Date(); // 현재 날짜
    
    const diff = (end - start); // 경과 시간
    
    const times = [
        {time: "분", milliSeconds: 1000 * 60},
        {time: "시간", milliSeconds: 1000 * 60 * 60},
        {time: "일", milliSeconds: 1000 * 60 * 60 * 24},
        {time: "개월", milliSeconds: 1000 * 60 * 60 * 24 * 30},
        {time: "년", milliSeconds: 1000 * 60 * 60 * 24 * 365},
    ].reverse();
    
    // 년 단위부터 알맞는 단위 찾기
    for (const value of times) {
        const betweenTime = Math.floor(diff / value.milliSeconds);
            
        // 큰 단위는 0보다 작은 소수 단위 나옴
        if (betweenTime > 0) {
        return `${betweenTime}${value.time} 전`;
        }
    }
    
    // 모든 단위가 맞지 않을 시
    return "방금 전";

}
  useEffect(()=>{
    axios.get(SERVER_URL, {
      headers: {
        'Authorization': localStorage.getItem('access_token'),
      }  
    }).then((res) => {
      setItems(res.data.suggests);
      setIslogin(res.data.msg.islogin);
    });
  }, []);

  useEffect(() => {

    setCount(items.length);
    setIndexOfLastPost(currentpage * postPerPage);
    setIndexOfFirstPost(indexOfLastPost - postPerPage);
    setCurrentPosts(items.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentpage, indexOfFirstPost, indexOfLastPost, items, postPerPage]);
  
  
  const setPage = (e) => {
    setCurrentpage(e);
  };
  const moveWritePage = () => {
    navigate("/page-Suggest/write");
  }

  return (
    <div className="SuggestList-wrap">
      <h1>건의사항/정보수정요청</h1>
      <div className="SuggestList-content">
        <div className="listInfo-wrap">
          <span>총 <b>{count}</b>개</span>
          {islogin && <button onClick={moveWritePage}>🖉글쓰기</button>}
        </div>
        <div className="SuggestList-top">
            <div className="num">번호</div>
            <div className="title">제목</div>
            <div className="writer">작성자</div>
            <div className="date">작성일</div>
        </div>
        {currentPosts && items.length > 0 ? currentPosts.map((item, index)=> (
        <div className="Suggest-obj">
          <div className="num">{items.length-((currentpage-1) * postPerPage)-index}</div>
          <div className="title"><Link to={'/page-Suggest/view/' + item._id}  style={{ textDecoration: "none", color:'inherit'}}>{item.title}</Link></div>
          <div className="writer">{item.writer}</div>
          <div className="date">{elapsedTime(item.date)}</div>
        </div>
        
        )) : <div>게시물이 없습니다.</div> } 
      </div>
      
      <Paging page={currentpage} count={count} setPage={setPage} /> 
    </div>
  )
};

export default PageSuggest;
