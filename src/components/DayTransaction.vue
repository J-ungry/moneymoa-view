<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 데이터 변수 선언
const dayTransaction = ref(null);
const selectedDate = ref(new Date().toISOString().split('T')[0]); // 오늘 날짜 기본 설정

// 트랜잭션 추가를 위한 입력 값 변수
const newTransactionType = ref('DEPOSIT'); // 기본값은 DEPOSIT
const newTransactionAmount = ref(0);
const newTransactionDescription = ref('');

// Authorization 토큰
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtM2o2VkZ2LS14eTMwdmpnODRmMVJKQU5WcU5HMG9ZMDN0UFRQalZ3OWdzIn0.eyJleHAiOjE3MjUyMDMyNjIsImlhdCI6MTcyNTE4NTI2MiwianRpIjoiN2NiMTZmNjgtZjY4ZS00MDcxLTg3MWQtM2E3ZDljY2E0OGRjIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5kZXZ5b29uLmtyL3JlYWxtcy9qdW5ncnlyZWFsbSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI2YTg1M2JhNC0xYWQyLTQ3MGQtOWM4Zi1iM2RhZWIyNGE5YzAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJqdW5ncnktY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjM2N2ZiOTliLTQ1NmUtNDRkOS04Mjg2LTIyMTZkYjZhNTU4MCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgxIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1qdW5ncnlyZWFsbSJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6IjM2N2ZiOTliLTQ1NmUtNDRkOS04Mjg2LTIyMTZkYjZhNTU4MCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6InNlbyBqdW5ncnkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqdW5ncnkiLCJnaXZlbl9uYW1lIjoic2VvIiwiZmFtaWx5X25hbWUiOiJqdW5ncnkiLCJlbWFpbCI6Imp1bmdyeUBnbWFpbC5jb20ifQ.EiCLp5R-la6CTHwv-I5uRQULsC61GRImPJrQvXZEzpZIAzSMtIQZ9ZKDsnRaTF8krQmKOqtGpVa3fRLWQp82gmRSS9JtPCg89rBKQwykpg1G2aSjGhcnZEQdFv17ZuMocSMByGcdFG0-6hk7i9V_M37NRFm-D0Cy1B0GSO6CLJRnyIaGl-tbvp-eXw2T0g3xNhr7x9ZJgkOUIQox7hFpJ1zh3p-0IEAFfylfZeFJOb3q6eUwohSlRyBxRChW9q5GAuxa8m52s5OSyTvlni2FxzdwQ_tk1vwltnTKRkKDD0sBn83fpRe7hQ0TY6pnNOk8rBmL4M7Ner-ueoXlBBFrfw';

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
      })
      .catch(error => {
        console.error('트랜잭션 추가 실패:', error);
      });
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
      })
      .catch(error => {
        console.error('트랜잭션 삭제 실패:', error);
      });
};

// 오늘 날짜로 API 호출
onMounted(() => {
  fetchDayTransaction(selectedDate.value);
});
</script>

<template>
  <div>
    <h1>Day Transaction Information</h1>
    <div>
      <p>Selected Date: {{ selectedDate }}</p>
      <button @click="changeDate(-1)">Yesterday</button>
      <button @click="changeDate(1)">Tomorrow</button>
    </div>
    <div v-if="dayTransaction">
      <p>Date: {{ dayTransaction.date }}</p>
      <p>Total Increase: {{ dayTransaction.totalIncrease }}</p>
      <p>Total Decrease: {{ dayTransaction.totalDecrease }}</p>
      <h2>Transactions:</h2>
      <ul>
        <li v-for="transaction in dayTransaction.transactions" :key="transaction.id">
          Description: {{ transaction.description }}, Amount: {{ transaction.amount }}, Type: {{ transaction.type }}
          <button @click="deleteTransaction(transaction.id)">Delete</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>

    <h2>Add New Transaction</h2>
    <div>
      <label for="type">Type:</label>
      <select v-model="newTransactionType">
        <option value="DEPOSIT">Deposit</option>
        <option value="WITHDRAWAL">Withdrawal</option>
      </select>

      <label for="amount">Amount:</label>
      <input type="number" v-model="newTransactionAmount" />

      <label for="description">Description:</label>
      <input type="text" v-model="newTransactionDescription" />

      <button @click="addTransaction">Add Transaction</button>
    </div>
  </div>
</template>

<style scoped>
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
</style>
