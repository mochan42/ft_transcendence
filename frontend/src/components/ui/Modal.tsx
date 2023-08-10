import React from 'react'
import { Button } from './Button'

function Modal() {
    return (
        <div>
            <div>
                <Button>
                    Close
                </Button>
                <div>
                    <h1>Title</h1>
                </div>
                <div>
                    <p>Body</p>
                </div>
                <div>
                    <Button>
                        Cancel
                    </Button>
                    <Button>
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Modal