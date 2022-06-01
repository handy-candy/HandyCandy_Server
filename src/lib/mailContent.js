// mailDB에 저장할 메일 내용 형식
// 리턴값은 title(메일 제목), content(메일 내용)

module.exports = {
  // 날짜가 정해진 보상: 이틀전
  before2day: (month, day, user_name, candy_name, candy_image, candy_link, handycandy_link) => {
    return {
      title: `${month}월 ${day}일의 ${user_name}님에게`,
      content: `
      <h3> ${month}월 ${day}일의 ${user_name}님에게 </h3>
      <p>
        안녕하세요, 핸디캔디입니다. <br/>
        이틀뒤면, ${candy_name}을/를 하는 보상데이에요!(소리질러)<br/>     
        설레는 마음으로, ${candy_name}을/를 함께 기다려보아요~<br/>      

        <a href="${candy_link}">     
          <img src="${candy_image}" alt="${candy_name} 보러가기"/>
        </a>

        <br/>
        더 많은 정보는?<br/>
        <a href="${handycandy_link}">
          <button type="button" >핸디캔디로 이동하기</button>      
        </a>         
      </p> 
      `,
    };
  },
  // 날짜가 정해진 보상: 당일
  Dday: (month, day, user_name, candy_name, candy_image, candy_link, handycandy_link) => {
    return {
      title: `${month}월 ${day}일의 ${user_name}님에게`,
      content: `
        <h3> ${month}월 ${day}일의 ${user_name}님에게 </h3>
        <p>
          안녕하세요, 핸디캔디입니다. <br/>
          드디어.....! 오늘은 ${candy_name}을/를 하는 날이에요!!!(소리벗고 팬티질러)<br/>     
          나를 위한 시간을 가질 자격이 있는 ${user_name}님, 오늘  나를 듬뿍 사랑하는 하루를 가져보세요.<br/>      
  
          <a href="${candy_link}">     
            <img src="${candy_image}" alt="${candy_name} 보러가기"/>
          </a>
          
          <br/>
          어떤 행복이 기다리고 있을지 설레는 마음으로 꾸욱!<br/>          
          <a href="${handycandy_link}">
            <button type="button" >핸디캔디로 이동하기</button>      
          </a>
        </p> 
        `,
    };
  },
  // 담은 날짜에서 18일 뒤
  saveAfter18day: (month, day, user_name, candy_name, candy_image, candy_link, handycandy_link) => {
    return {
      title: `${month}월 ${day}일의 ${user_name}님에게`,
      content: `
        <h3> ${month}월 ${day}일의 ${user_name}님에게 </h3>
        <p>
          안녕하세요, 핸디캔디입니다. <br/>
          ${user_name}님이 ${candy_name}을/를 담은지 18일째 되는 날이에요~ 오늘의 나에게 깜짝 보상으로, 지친 하루에 달콤함을 더해보는 건 어떨까요?<br/>      
  
          <a href="${candy_link}">     
            <img src="${candy_image}" alt="${candy_name} 보러가기"/>
          </a>
          
          <br/>
          더 많은 정보는?<br/>
          
          <a href="${handycandy_link}">
            <button type="button" >핸디캔디로 이동하기</button>      
          </a>
        </p> 
        `,
    };
  },

  // 완료한지 일주일 뒤
  rewardAfter7day: (month, day, user_name, candy_name, candy_image, candy_link, handycandy_link) => {
    return {
      title: `${month}월 ${day}일의 ${user_name}님에게`,
      content: `
        <h3> ${month}월 ${day}일의 ${user_name}님에게 </h3>
        <p>
          안녕하세요, 핸디캔디입니다. <br/>
          ${user_name}님이 ${candy_name}을/를 한 지, 일주일이 지났어요!<br/>      
          당시 어떤 감정을 느끼셨나요?<br/>
          즐거웠던 그 시간을 추억해보는 시간을 가져보세요!<br/>

          <a href="${candy_link}">     
            <img src="${candy_image}" alt="${candy_name} 보러가기"/>
          </a>   
          
          <br/>
          <a href="${handycandy_link}">
           <button type="button" >핸디캔디로 이동하기</button>      
          </a>
          <br/>
          행복했던 나를 기억하며, 오늘도 만족스러운 하루를 보내세요~<br/>
        </p> 
        `,
    };
  },

  // 담은 날짜에서 2개월 뒤
  saveAfter2month: (month, day, user_name, candy_name, candy_image, candy_link, handycandy_link) => {
    return {
      title: `${month}월 ${day}일의 ${user_name}님에게`,
      content: `
            <h3> ${month}월 ${day}일의 ${user_name}님에게 </h3>
            <p>
              안녕하세요, 핸디캔디입니다. <br/>
              ${user_name}님이 ${candy_name}을/를 담은지 2개월이 되는 날이에요~ 오늘의 보상을 내일로 미루지 말라는 명언이 있죠!<br/>      
              오늘 GO? <br/>
    
              <a href="${candy_link}">     
                <img src="${candy_image}" alt="${candy_name} 보러가기"/>
              </a>
              
              <br/>
              더 많은 정보는?<br/>
              <a href="${handycandy_link}">
                <button type="button" >핸디캔디로 이동하기</button>      
              </a>            
            </p> 
            `,
    };
  },
};
