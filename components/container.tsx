import { FC } from 'react'

interface ContainerProps {
	children: React.ReactNode
}

const Container: FC<ContainerProps> = ({ children }) => {
	return (
		<div className='w-full h-full px-6 py-8 md:px-8 xl:px-12'>{children}</div>
	)
}
export default Container

