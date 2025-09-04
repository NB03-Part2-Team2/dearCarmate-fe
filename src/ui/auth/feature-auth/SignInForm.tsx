import classNames from 'classnames/bind'
import styles from './SignInForm.module.scss'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { SignInFormInput } from '@shared/types'
import FieldLabel from '@ui/shared/input/FieldLabel/FieldLabel'
import TextFieldConnect from '@ui/shared/form-field/TextFieldConnect'
import PasswordFieldConnect from '@ui/shared/form-field/PasswordFieldConnect'
import Button from '@ui/shared/button/Button'
import Link from 'next/link'
import { EMAIL_VALIDATION_REGEXP } from '@ui/shared/util-constants/constants'
import useSignIn from '../data-access-auth/useSignIn'

const cx = classNames.bind(styles)

type SignInFormProps = {

}

const SignInForm = ({ }: SignInFormProps) => {
  const methods = useForm<SignInFormInput>()
  const { mutate, isPending } = useSignIn()

  const handleSignIn: SubmitHandler<SignInFormInput> = async (data) => {
    mutate(data)
  }

  return (
    <FormProvider {...methods}>
      <div className={cx('welcomeSection')}>
        <h1 className={cx('title')}>환영합니다! 👋</h1>
        <p className={cx('subtitle')}>디어카메이트로 스마트한 차량 관리를 시작하세요</p>
      </div>

      <form className={cx('container')} onSubmit={methods.handleSubmit(handleSignIn)}>
        <div className={cx('inputs')}>
          <div>
            <FieldLabel label='이메일' />
            <TextFieldConnect
              name='email'
              autoComplete='email'
              placeholder='이메일을 입력해 주세요'
              rules={{
                required: '필수 입력사항입니다',
                pattern: {
                  value: EMAIL_VALIDATION_REGEXP,
                  message: '이메일 형식에 맞지 않습니다',
                },
              }}
            />
          </div>
          <div>
            <FieldLabel label='비밀번호' />
            <PasswordFieldConnect
              name='password'
              autoComplete='current-password'
              rules={{
                required: '필수 입력사항입니다',
              }}
            />
          </div>
        </div>
        <Button className={cx('button')} type='submit' size='large' theme='red' disabled={isPending}>
          {isPending ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <p className={cx('message')}>
        디어카메이트가 처음이신가요?
        <Link className={cx('signup')} href='/signup'>
          회원가입
        </Link>
      </p>
    </FormProvider>
  )
}

export default SignInForm
