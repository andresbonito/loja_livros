import json
import boto3

client = boto3.client('dynamodb')
livros_table = 'lojaLivros'

def lambda_handler(event, context):
    print(f'Evento: {event}')
    
    id = event['livro_id']
    
    
    response = get_livros(id)
    
    livros_ids = []
    
    for item in response:
        new_response = deep_clean_field(item)
        livros_ids.append(new_response)
    
    return {
        'statusCode': 200,
        'message': livros_ids
    }

def get_livros(livro_id):
    response = client.query(
        TableName=livros_table,
        KeyConditionExpression='#livro_id = :livro_id',
        ExpressionAttributeNames={
            '#livro_id': 'livro_id'
        },
        ExpressionAttributeValues={
            ':livro_id': {
                'S': livro_id
            }
        }
    )
    
    items = response['Items']
    
    return items
    
def deep_clean_field(raw_dict: dict):
    response = {}

    for key, value in raw_dict.items():
        if key in ['S', 'N', 'B', 'L', 'NS', 'SS', 'BS', 'BOOL', ]:
            return value
        if key in ['NULL', ]:
            return None
        elif key in ['M', ]:
            return deep_clean_field(value)
        else:
            response.update({key: deep_clean_field(value)})

    return response