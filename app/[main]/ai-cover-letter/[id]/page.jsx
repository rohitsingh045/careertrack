import React from 'react'

const CoverLetter =async ({prams}) => {
  const id = await prams.id;
    
  return (
    <div>
      CoverLetter:{id}
    </div>
  )
}

export default CoverLetter
