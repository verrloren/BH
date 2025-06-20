import { FC } from 'react'

interface ContainerProps {
	children: React.ReactNode
}

const Container: FC<ContainerProps> = ({ children }) => {
	return (
		<div className='w-full h-full px-6 py-8 xl:pt-12 md:px-8 lg:px-8 xl:px-16 2xl:px-48'>{children}</div>
	)
}
export default Container

