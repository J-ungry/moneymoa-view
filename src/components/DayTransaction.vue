<script setup>
import {ref, onMounted, inject} from 'vue';
import ModalConponent from "@/components/ModalConponent.vue";
import axios from 'axios';
import { keycloak } from "@/keycloak.js";

// 데이터 변수 선언
const dayTransaction = ref(null);
const monthTotal = ref(null);
const selectedDate = ref(new Date().toISOString().split('T')[0]); // 오늘 날짜 기본 설정

// 트랜잭션 추가를 위한 입력 값 변수
const newTransactionType = ref('DEPOSIT'); // 기본값은 DEPOSIT
const newTransactionAmount = ref(0);
const newTransactionDescription = ref('');

const isModalOpen = ref(false);

// 모달 열고 닫기 메소드
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const logout = () => {
  console.log("logout");
  keycloak.logout();
};

// Authorization 토큰
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtM2o2VkZ2LS14eTMwdmpnODRmMVJKQU5WcU5HMG9ZMDN0UFRQalZ3OWdzIn0.eyJleHAiOjE3MjUyMDMyNjIsImlhdCI6MTcyNTE4NTI2MiwianRpIjoiN2NiMTZmNjgtZjY4ZS00MDcxLTg3MWQtM2E3ZDljY2E0OGRjIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5kZXZ5b29uLmtyL3JlYWxtcy9qdW5ncnlyZWFsbSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI2YTg1M2JhNC0xYWQyLTQ3MGQtOWM4Zi1iM2RhZWIyNGE5YzAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJqdW5ncnktY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjM2N2ZiOTliLTQ1NmUtNDRkOS04Mjg2LTIyMTZkYjZhNTU4MCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgxIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1qdW5ncnlyZWFsbSJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6IjM2N2ZiOTliLTQ1NmUtNDRkOS04Mjg2LTIyMTZkYjZhNTU4MCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6InNlbyBqdW5ncnkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqdW5ncnkiLCJnaXZlbl9uYW1lIjoic2VvIiwiZmFtaWx5X25hbWUiOiJqdW5ncnkiLCJlbWFpbCI6Imp1bmdyeUBnbWFpbC5jb20ifQ.EiCLp5R-la6CTHwv-I5uRQULsC61GRImPJrQvXZEzpZIAzSMtIQZ9ZKDsnRaTF8krQmKOqtGpVa3fRLWQp82gmRSS9JtPCg89rBKQwykpg1G2aSjGhcnZEQdFv17ZuMocSMByGcdFG0-6hk7i9V_M37NRFm-D0Cy1B0GSO6CLJRnyIaGl-tbvp-eXw2T0g3xNhr7x9ZJgkOUIQox7hFpJ1zh3p-0IEAFfylfZeFJOb3q6eUwohSlRyBxRChW9q5GAuxa8m52s5OSyTvlni2FxzdwQ_tk1vwltnTKRkKDD0sBn83fpRe7hQ0TY6pnNOk8rBmL4M7Ner-ueoXlBBFrfw'; // 실제 토큰으로 대체

// API 호출 함수
const fetchDayTransaction = (date) => {
  axios.get(`http://localhost:8080/api/v1/day-transaction/day?date=${date}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
      .then(response => {
        dayTransaction.value = response.data;
      })
      .catch(error => {
        console.error('API 호출 에러:', error);
      });
};

// 날짜 변경 함수
const changeDate = (days) => {
  const currentDate = new Date(selectedDate.value);
  currentDate.setDate(currentDate.getDate() + days);
  selectedDate.value = currentDate.toISOString().split('T')[0];
  // 날짜 변경 후 새 트랜잭션 데이터 가져오기
  fetchDayTransaction(selectedDate.value);
};

// 트랜잭션 추가 함수
const addTransaction = () => {
  const createTransactionRequest = {
    type: newTransactionType.value,
    amount: newTransactionAmount.value,
    description: newTransactionDescription.value
  };

  axios.post('http://localhost:8080/api/v1/day-transaction', createTransactionRequest, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log('트랜잭션 추가 성공:', response.data);
        // 트랜잭션 추가 후, 업데이트된 트랜잭션 목록을 가져옴
        fetchDayTransaction(selectedDate.value);
        // 입력 폼 초기화
        newTransactionType.value = 'DEPOSIT';
        newTransactionAmount.value = 0;
        newTransactionDescription.value = '';
        fetchMonthTotal();
      })
      .catch(error => {
        console.error('트랜잭션 추가 실패:', error);
      });
  closeModal();
};

// 트랜잭션 삭제 함수
const deleteTransaction = (transactionId) => {
  axios.delete(`http://localhost:8080/api/v1/day-transaction?id=${transactionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
      .then(response => {
        console.log('트랜잭션 삭제 성공:', response.data);
        // 트랜잭션 삭제 후, 업데이트된 트랜잭션 목록을 가져옴
        fetchDayTransaction(selectedDate.value);
        fetchMonthTotal();
      })
      .catch(error => {
        console.error('트랜잭션 삭제 실패:', error);
      });
};

const fetchMonthTotal = () => {
  const year = new Date(selectedDate.value).getFullYear();
  const month = new Date(selectedDate.value).getMonth() + 1; // JavaScript의 getMonth()는 0부터 시작하므로 1을 더함
  const formattedMonth = month < 10 ? `0${month}` : month; // 월이 한 자리 숫자일 경우 앞에 '0'을 붙임
  const dateString = `${year}-${formattedMonth}`; // 'YYYY-MM' 형식으로 날짜를 조합

  axios.get(`http://localhost:8080/api/v1/global/month-total?date=${dateString}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
      .then(response => {
        monthTotal.value = response.data;
      })
      .catch(error => {
        console.error('월별 트랜잭션 요약 가져오기 실패:', error);
      });
};

// 오늘 날짜로 API 호출
onMounted(() => {
  fetchDayTransaction(selectedDate.value);
  fetchMonthTotal();
});
</script>

<template>
  <div>
    <div v-if="monthTotal" class="month-total">
      <p>{{ monthTotal.year }}년 {{ monthTotal.month }}월</p>
      <p>입금: {{ monthTotal.totalDeposit }}</p>
      <p>출금: {{ monthTotal.totalWithdrawal }}</p>
      <p>총액: {{ monthTotal.totalAmount }}</p>
    </div>
    <div v-else>
      <p>로딩 중...</p>
    </div>
  </div>
  <div>
    <h1 style="display: flex; align-items: center; justify-content: center;">
      <!-- 왼쪽 화살표 버튼 (스타일 변경) -->
      <span @click="changeDate(-1)" class="arrow-button">&larr;</span>

      <!-- 선택된 날짜 출력 -->
      <span style="margin: 0 20px;">{{ selectedDate }}</span>

      <!-- 오른쪽 화살표 버튼 (스타일 변경) -->
      <span @click="changeDate(1)" class="arrow-button">&rarr;</span>
    </h1>

    <div v-if="dayTransaction" class="day-transaction">
      <div class="today-summary">
        <p>수입: {{ dayTransaction.totalIncrease }}</p>
        <p>지출: {{ dayTransaction.totalDecrease }}</p>
      </div>
      <h2>내역</h2>
      <hr>
      <ul>
        <li v-for="transaction in dayTransaction.transactions" :key="transaction.id">
          {{ transaction.description }}, 금액: {{ transaction.amount }}, 타입: {{ transaction.type }}
          <button @click="deleteTransaction(transaction.id)" class ="delete-button">X</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>

    <div>
      <!-- Existing code for transactions and summary -->

      <span @click="openModal" class="add-transaction-button">트랜잭션 추가</span>

      <span @click="logout" class="add-transaction-button">로그아웃</span>

      <!-- 모달 -->
      <ModalComponent v-if="isModalOpen" @close="closeModal">
        <h2>트랜잭션 추가</h2>
        <div>
          <label for="type">유형:</label>
          <select v-model="newTransactionType">
            <option value="DEPOSIT">입금</option>
            <option value="WITHDRAWAL">출금</option>
          </select>

          <label for="amount">금액:</label>
          <input type="number" v-model="newTransactionAmount" />

          <label for="description">설명:</label>
          <input type="text" v-model="newTransactionDescription" />

          <button @click="addTransaction">제출</button>
        </div>
      </ModalComponent>
    </div>
  </div>
</template>

<style scoped>
.arrow-button {
  font-size: 24px;
  cursor: pointer;
  user-select: none;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  outline: none;
  color: #007bff;
  transition: color 0.3s ease;
}

.arrow-button:hover {
  color: #0056b3;
}

.add-transaction-button {
  color: #0056b3; /* 텍스트 색상 */
  padding: 8px 15px; /* 상하, 좌우 패딩 */
  font-size: 16px; /* 글자 크기 */
  border: 1px solid #0056b3; /* 테두리 색상 및 두께 */
  border-radius: 5px; /* 모서리 둥글기 */
  cursor: pointer; /* 마우스 오버 시 커서 모양 */
  transition: background-color 0.3s; /* 배경색 변경 애니메이션 */
}

.add-transaction-button:hover {
  color: #0056b3;
}

hr {
  border: none;
  height: 1px;
  background-color: #ccc;
  margin-top: 10px;
}

button {
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 16px;
}

input, select {
  margin-right: 10px;
  padding: 5px;
  font-size: 16px;
}

label {
  margin-right: 5px;
}
.today-summary {
  display: flex;
  justify-content: left;
  align-items: center;
  margin: 20px 0;
}

.today-summary p {
  margin: 0 10px;
  font-size: 18px;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin-bottom: 10px;
}

.delete-button {
  background: none;
  border: none;
  color: red;
  font-size: 15px;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.delete-button:hover {
  color: darkred;
}
.day-transaction {
  padding-bottom: 20px;
}
</style>
