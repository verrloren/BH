import { FC } from 'react'

interface ContainerProps {
	children: React.ReactNode
}

const Container: FC<ContainerProps> = ({ children }) => {
	return (
		<div className='w-full h-full px-6 py-8 xl:pt-12 md:px-8 lg:px-16 xl:px-24'>{children}</div>
	)
}
export default Container

