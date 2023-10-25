import json
import boto3

client = boto3.client('dynamodb')
livros_table = 'lojaLivros'

def lambda_handler(event, context):
    print(f"Evento: {event}")
    
    id = event['livro_id']
    nome = event['nome']
    classificacao = event['classificação']
    
    raw_dict = {
        'livro_id': {'S': id},
        'nome': {'S': nome},
        'classificacao': {'N': f'{classificacao}'}
    }
    
    response = creating_item_ddb(raw_dict)
    
    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        return {
            'Operação': "Concluida!",
            'Item': raw_dict
        }
    else:
        return {
            'Operação': "Falha!"
        }
    
def creating_item_ddb(raw_dict: dict):
    response = client.put_item(
        TableName=livros_table,
        Item=raw_dict,
        ConditionExpression="attribute_not_exists(livro_id)"
        )
        
    return response