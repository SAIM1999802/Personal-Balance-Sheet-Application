    const BASE_URL = 'http://localhost:3000'
    const API = {
        getHeaders(){
            const token = localStorage.getItem('token')
            return{
                'Content-Type': 'application/json',
                'Authorization':token ? `Bearer ${token}`:''
            };
        },
        async signup(user_name,email,password){
            const res = await fetch('/api/auth/signup',{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({user_name,email,password})
            })
            return await res.json();
        },

        async signin(user_name,password){
            const res = await fetch('/api/auth/signin',{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({user_name,password})
            })
            return await res.json();
        },

        async getTransactions(){
            const res = await fetch('/transactions',{
                method: 'GET',
                headers: this.getHeaders()
            });
            if (res.status === 401 ||res.status === 403 ){
                this.logout()
                return[];
            }
            return await res.json();
        },
        async saveTransactions(transObj){
            const res = await fetch('/transactions',{
                method: 'POST',
                headers: this.getHeaders(),
                body:JSON.stringify(transObj)
            })
            return await res.json()
        },
        async clearTransactions(){
            const res = await fetch('/transactions',{
                method: 'DELETE',
                headers: this.getHeaders()
            })
            return await res.json()
        },
        async logout(){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.replace('login.html')
        }
    }

    