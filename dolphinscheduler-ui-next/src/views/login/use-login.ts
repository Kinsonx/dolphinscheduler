/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useRouter } from 'vue-router'
import { login } from '@/service/modules/login'
import { getUserInfo } from '@/service/modules/users'
import { useUserStore } from '@/store/user/user'
import type { Router } from 'vue-router'
import type { SessionIdRes } from '@/service/modules/login/types'
import type { UserInfoRes } from '@/service/modules/users/types'
import { useMenuStore } from '@/store/menu/menu'
import cookies from 'js-cookie'

export function useLogin(state: any) {
  const router: Router = useRouter()
  const userStore = useUserStore()
  const menuStore = useMenuStore()

  const handleLogin = () => {
    state.loginFormRef.validate(async (valid: any) => {
      if (!valid) {
        const loginRes: SessionIdRes = await login({ ...state.loginForm })
        await userStore.setSessionId(loginRes.sessionId)
        cookies.set('sessionId', loginRes.sessionId, { path: '/' })

        const userInfoRes: UserInfoRes = await getUserInfo()
        await userStore.setUserInfo(userInfoRes)

        const key = menuStore.getMenuKey

        router.push({ path: key || 'home' })
      }
    })
  }

  return {
    handleLogin
  }
}